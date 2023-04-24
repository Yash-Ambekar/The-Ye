let stores = [
    {
        storeID: 0,
        StoreName: "Soham's Medical Store",
        storePhoneNumber: "917028442761"
    },
    {
        storeID: 1,
        StoreName: "Parth's Medical Store",
        storePhoneNumber: "918380974904"
    },
    // {
    //     storeID: 2,
    //     StoreName: "Pankaj's Medical Store",
    //     storePhoneNumber: "917028442761"
    // },
    {
        storeID: 3,
        StoreName: "Yash's Medical Store",
        storePhoneNumber: "917021938092"
    }
]


async function getStores(){
    // Implement this using Google maps API
    return stores;
}

module.exports = {
    stores,
    getStores
}