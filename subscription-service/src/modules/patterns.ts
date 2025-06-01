export const patterns = {
    SUBSCRIPTION: {
        CREATE_SUBSCRIPTION: { cmd: 'create_subscription' },
    },
    CONFIRMATION: {
        GET_TOKEN:{ cmd: 'confirm-subscription'},
    },
    UNSUBSCRIPTION: {
        GET_TOKEN: { cmd: 'unsubscribe-subscription' },
    }
}