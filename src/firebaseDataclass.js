import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";

function triggerJsonDownload(object) {
    const date = new Date().toISOString();
    const filename = `${date}-export.json`;
    
    let link = document.createElement('a');
    link.href = URL.createObjectURL(
        new Blob([JSON.stringify(object)],
        {type: "application/json"})
    );
    link.download = filename;
    link.click();
}


// ==firebaseDrain==
//  storeDrainData() => this.data
//  firebaseFetchData()
class firebaseDrain {
    constructor(props) {
        this.firebaseConfig = {
            apiKey: "AIzaSyBuOyvPrVKJ3-UiMCD3TvQ9MrJcjodwl44",
            authDomain: "jtan-messaging.firebaseapp.com",
            databaseURL: "https://jtan-messaging-default-rtdb.asia-southeast1.firebasedatabase.app",
            projectId: "jtan-messaging",
            storageBucket: "jtan-messaging.appspot.com",
            messagingSenderId: "212453034132",
            appId: "1:212453034132:web:5d9a5537ac797b917ccc81"
        };
        this.app = initializeApp(this.firebaseConfig);
        this.database = getDatabase(app);

        this.uuid = props.uuid;
    }

    async function firebaseFetchData(path, noOfChildren) {
        const limitedQuery = query(ref(this.database, path), limitToFirst(noOfChildren));
    
        return get(limitedQuery).then((snapshot)=>snapshot.val());
    }

    async function firebaseGetDrainData(uuid, noOfChildren, success) {
        const drainName = await firebaseFetchData(`/uuids/${uuid}`);
        const drainData = await firebaseFetchData(`/data/${uuid}`);
    
        let data = [];
        // { "$DRAINUUID": { "$UUID": { epoch: ..., ...} } }
        for (let key in drainData) {
            const element = drainData[key];
            data.push({ name: new Date(element.epoch),
                        cl: parseFloat(element.current_level),
                        tl: parseFloat(element.flood_threshold) });
        }
        success(drainName, drainData);
    }
}

export default {firebaseGetDrainData, firebaseFetchData};
