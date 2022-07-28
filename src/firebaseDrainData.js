import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, query, limitToFirst, limitToLast } from "firebase/database";

//firebase stuff
const firebaseConfig = {
  apiKey: "AIzaSyCkrrH0grVByOer9uFNihCLESnGVMM0guw",
  authDomain: "iot-draintector.firebaseapp.com",
  databaseURL: "https://iot-draintector-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iot-draintector",
  storageBucket: "iot-draintector.appspot.com",
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
    const dataUpdates = await firebaseQueryFull(`/updates/${uuid}`);
    const reversedUpdates = Object.values(dataUpdates).reverse();
    let noOfUpdates = 0; 
    let offset = 0; // to slice array later
    for (let epoch of reversedUpdates) {
        if (epoch < timeStart) break;

        if (epoch > timeEnd) offset += 1;
        noOfUpdates+= 1;
    }

    const drainName = await firebaseQueryFull(`/uuids/${uuid}`);
    const drainData  = await firebaseQueryWithConstraint(
        `/History/${uuid}`,
        noOfUpdates,
        limitToLast
    );
    let dataWithinTimeRange = [];
    for (let key in drainData) {
        const sensor = drainData[key];
        const withinTimeRange = Object.values(sensor).slice(0, noOfUpdates-offset);

        let object = {}; object[key] = withinTimeRange;
        dataWithinTimeRange.push(object);
    }

    callback(drainName, dataWithinTimeRange);
}

async function firebaseGetAllDataLatest(callback) {
    let rows = [];

    const uuids = await firebaseQueryFull('/uuids/');
    for (let key in uuids) {
        console.log(key);
        const latestDataPoint = await firebaseQueryFull(`/Realtime/${key}`);
        //latestDataPoint = Object.values(latestDataPoint)[0];

        rows.push({ uuid: key, name: uuids[key], data: {
            time: new Date(latestDataPoint.Timestamp).toLocaleString(),
            cl: parseFloat(latestDataPoint.Distance),
        }});
    }
    callback(rows);
}

async function firebaseGetDataRealtime(uuid, callback) {
    const drainName = await firebaseQueryFull(`/uuids/${uuid}`);
    const realtimeData = await firebaseQueryFull(`/Realtime/${uuid}`);

    //data.Timestamp = new Date(data.Timestamp).toLocaleTimeString();

    callback(drainName, realtimeData);
}

export {firebaseGetDataTimeRange, firebaseGetAllDataLatest, firebaseGetDataRealtime};
