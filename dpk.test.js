const { deterministicPartitionKey } = require("./dpk");

// for even better testing, we can mock this module, but in this case it's third party module, which we can treat as ideal.
const crypto = require("crypto");

/**
 * Test cases
 * 1) event passed/not
 * 2) partionKey passed/not
 * 3) candidate (passed partitionKey) is not string
 * 4) candidate (partitionKey or created hash) is longer then max partition key length
 */

//We'll separate this to function to easily reuse between tests
function getHash(data){
  return crypto
      .createHash("sha3-512")
      .update(data)
      .digest("hex")
}

const LONG_PARTITION_KEY = new Array(257).fill().map((_, i) => i).join('')

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });

  it("Returns hash of event when given empty event (no partitionKey passed)", () => {
    const emptyEvent = {}
    const hashOfNothing = deterministicPartitionKey(emptyEvent);
    const hash = getHash(JSON.stringify(emptyEvent))
    expect(hashOfNothing).toBe(hash);
  });

  it("Returns hash of event when given non-empty event (no partitionKey passed)", () => {
    const emptyEvent = {name: 'Bob', id: 32}
    const hashOfNothing = deterministicPartitionKey(emptyEvent);
    const hash = getHash(JSON.stringify(emptyEvent))
    expect(hashOfNothing).toBe(hash);
  });

  it("Returns partitionKey when given empty event AND partition Key", () => {
    const emptyEvent = {partitionKey: '123'}
    const hash = deterministicPartitionKey(emptyEvent);
    expect(hash).toBe('123');
  });

  it("Returns partitionKey when given non-empty event AND partition Key", () => {
    const emptyEvent = {name: 'Bob', id: 32, partitionKey: '123'}
    const hash = deterministicPartitionKey(emptyEvent);
    expect(hash).toBe('123');
  });

  it("Returns partitionKey as string when partitionKey is not string", () => {
    const emptyEvent = {partitionKey: 123}
    const hash = deterministicPartitionKey(emptyEvent);
    expect(hash).toBe('123');
  });

  it("Returns hash of partition key when partitionKey is Very long", () => {
    const emptyEvent = {partitionKey: LONG_PARTITION_KEY}
    const hash = deterministicPartitionKey(emptyEvent);
    const partitionKeyHash = getHash(LONG_PARTITION_KEY)
    expect(hash).toBe(partitionKeyHash);
  });


  it("Returns hash of event when data is Very long", () => {
    const emptyEvent = {name: new Array(1000).fill(LONG_PARTITION_KEY).join('')}
    const hashOfNothing = deterministicPartitionKey(emptyEvent);
    const hash = getHash(JSON.stringify(emptyEvent))
    expect(hashOfNothing).toBe(hash);
  });

});
