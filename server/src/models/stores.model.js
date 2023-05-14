var axios = require('axios');

let stores = [
    // {
    //     storeID: 0,
    //     StoreName: "Soham's Medical Store",
    //     lat: 19.46414031683653,
    //     long: 73.83218669449842,
    //     storePhoneNumber: "917028442761"
    // },
    // {
    //     storeID: 1,
    //     StoreName: "Parth's Medical Store",
    //     lat: 18.46490396061193,
    //     long: 73.83431215586559,
    //     storePhoneNumber: "918380974904"
    // },
    // {
    //     storeID: 2,
    //     StoreName: "Pankaj's Medical Store",
    //     lat: 18.468385695514733,
    //     long: 73.83333458652628,
    //     storePhoneNumber: "918000597921"
    // },
    {
        storeID: 3,
        StoreName: "Yash's Medical Store",
        lat: 19.10869426849005,
        long: 72.88467675985991,
        storePhoneNumber: "917021938092"
    }
]

async function getDistance(origin, destination) {
    let dist = 0;
    const orign_req = `${origin[0]},${origin[1]}`;
    const destn_req = `${destination[0]},${destination[1]}`;

    const url = ('https://maps.googleapis.com/maps/api/distancematrix/json?' + new URLSearchParams({
        origins: orign_req,
        destinations: destn_req,
        key: process.env['GOOGLE_MAPS_API_KEY']
    }))

    var config = {
        method: 'get',
        url: url,
    };

    const response = await axios(config);
    dist = response.data.rows[0].elements[0].distance.value;

    return dist;
}

async function getStores(userDetails) {
    const origin = [userDetails.latitude, userDetails.longitude];
    
    const newStores = [];
    await Promise.all(stores.map(async (store) => {
        const destination = [store.lat, store.long];
        const distance = await getDistance(origin, destination);
        // console.log("Distance = ",distance);
        if (distance < 5000) {
            // console.log("push", store.StoreName);
            newStores.push(store);
        }
    }));
    // console.log("NEW STORES - ", newStores);
    // console.log(await getDistance(origin, destination));
    return newStores;
}

module.exports = {
    stores,
    getStores
}