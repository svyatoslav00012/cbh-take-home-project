const crypto = require("crypto");
/**
 * Possible cases
 * 1) event passed/not
 * 2) partionKey passed/not
 * 3) candidate (passed partitionKey) is not string
 * 4) candidate passed (partitionKey or created hash) is longer then max partition key length
 *
 *
 * @param event
 * @returns hash:string
 */
const deterministicPartitionKey = event => {
    const TRIVIAL_PARTITION_KEY = "0";
    const MAX_PARTITION_KEY_LENGTH = 256;

    if(!event)
        return TRIVIAL_PARTITION_KEY

    const key = event.partitionKey

    if (key) {
        const stringKey = typeof key !== "string" ? JSON.stringify(key) : key

        if (stringKey.length > MAX_PARTITION_KEY_LENGTH) {
            return getHash(stringKey)
        } else {
            return stringKey
        }
    } else {
        return getHash(JSON.stringify(event))
    }
};

const HASH_ALGO = "sha3-512"
const DIGEST_ENCODING = "hex"

function getHash(data) {
    return crypto
        .createHash(HASH_ALGO)
        .update(data)
        .digest(DIGEST_ENCODING);
}

module.exports = {
    deterministicPartitionKey
}
