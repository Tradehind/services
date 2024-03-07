
const membershipPlans = {

    free:{
        accessContacts:10,
        leads:10,
        frequency:'month',
        days:30
    },
    silver:{
        accessContacts:30,
        leads:30,
        frequency:'month',
        days:30,
        rate: 5000,
        flagshipProducts:3
    },
    gold:{
        accessContacts:200,
        leads:100000,
        frequency:'month',
        days:30,
        rate: 30000,
        flagshipProducts:5
    },
    platinum:{
        accessContacts:100000,
        leads:100000,
        frequency:'month',
        days:30,
        rate: 30000,
        flagshipProducts:7
    },

}

module.exports = {
    membershipPlans
}