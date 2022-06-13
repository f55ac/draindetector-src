import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, query, limitToFirst, limitToLast } from "firebase/database";

//firebase stuff
const firebaseConfig = {
  apiKey: "AIzaSyBuOyvPrVKJ3-UiMCD3TvQ9MrJcjodwl44",
  authDomain: "jtan-messaging.firebaseapp.com",
  databaseURL: "https://jtan-messaging-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jtan-messaging",
  storageBucket: "jtan-messaging.appspot.com",
  messagingSenderId: "212453034132",
  appId: "1:212453034132:web:5d9a5537ac797b917ccc81"
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

async function firebaseQueryFull(path) {
    return get(ref(database, path)).then((snapshot) => snapshot.val());
}

async function firebaseQueryWithConstraint(path, noOfUpdates, queryConstraint) {
    let newQuery = query(ref(database, path), queryConstraint(noOfUpdates));
    return get(newQuery).then((snapshot)=>snapshot.val());
}

async function firebaseGetDataTimeRange(uuid, timeStart, timeEnd, callback) {
    const dataUpdates = await firebaseQueryFull(`/updates/${uuid}`, null);
    const reversedUpdates = Object.values(dataUpdates).reverse();
    let offset = 0; // to slice array later
    let noOfUpdates= 0;  
    for (let epoch of reversedUpdates) {
        if (epoch < timeStart) break;

        if (epoch > timeEnd) offset += 1;
        noOfUpdates+= 1;
    }

    const drainName = await firebaseQueryFull(`/uuids/${uuid}`, null);
    const drainData  = await firebaseQueryWithConstraint(`/data/${uuid}`, 
        noOfUpdates, limitToLast);
    const dataWithinTimeRange = Object.values(drainData).slice(0, noOfUpdates-offset);

    callback(drainName, dataWithinTimeRange);
}

async function firebaseGetDataLatest(callback) {
    // { name: "drain#1", data: { epoch: ... ...} }, { name: "drain#2" ... }
    let rows = [];

    const uuids = await firebaseQueryFull('/uuids/');
    for (let key in uuids) {
        let latestDataPoint = await firebaseQueryWithConstraint(`/data/${key}`, 1, 
            limitToLast);
        latestDataPoint = Object.values(latestDataPoint)[0];

        rows.push({ uuid: key, name: uuids[key], 
            time: new Date(latestDataPoint.epoch).toLocaleString(),
            cl: parseFloat(latestDataPoint.current_level),
            tl: parseFloat(latestDataPoint.flood_threshold)
        });
    }
    callback(rows);
}

export {firebaseGetDataTimeRange, firebaseGetDataLatest};
