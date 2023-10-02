import { Stronghold, Location } from './tauri-plugin-stronghold-api'

const snapshotFilePath = '/stronghold-test-snapshot.file'
const password = 'password'
const vaultPath = 'vault-path-0'
const clientPath = 'client-path-0'
const privateKeyPath = 'record-path-0'

// const stronghold = await Stronghold.load(snapshotFilePath, password)
const client = await stronghold.createClient(clientPath)
const vault = client.getVault(vaultPath)

const mnemonic = 'anxiety puppy weather mask talk hole sight glance electric heart inject local'
const mnemonicPassphrase = undefined
// const keyLocation = Location.generic(vaultPath, privateKeyPath)

// const result = vault.recoverBIP39(mnemonic, keyLocation, mnemonicPassphrase)

const seedLocation = Location.generic('vault-path-0', 'seed-path-0')
await vault.recoverBIP39(mnemonic, seedLocation, '')
const keyLocation = Location.generic('vault-path-0', 'key-path-1')
await vault.deriveSLIP10([44, 60, 0, 0, 0], 'Secp256k1', 'Seed', seedLocation, keyLocation)

await vault.getSecp256k1EcdsaPublicKey(keyLocation)
await vault.getEvmAddress(keyLocation)



let stronghold = (async () => {
    let StrongholdModule = await import('./src/stronghold/tauri-plugin-stronghold-api');
    const snapshotFilePath = '../stronghold-test-snapshot.file';
    const password = 'fJF*(SDF*(*@J!)(SU*(D*F&^&TYSDFHL#@HO*&O';
    const st = await StrongholdModule.Stronghold.load(snapshotFilePath, password);
    const client = await st.createClient('client-path-0');
    const vault = client.getVault('vault-path-0');

    let mnemonic = 'anxiety puppy weather mask talk hole sight glance electric heart inject local';
    const seedLocation = StrongholdModule.Location.generic('vault-path-0', 'seed-path-0');

    await vault.recoverBIP39(mnemonic, seedLocation, '');
    const keyLocation = StrongholdModule.Location.generic('vault-path-0', 'key-path-1');
    await vault.deriveSLIP10([44, 60, 0, 0, 0], "Secp256k1", "Seed", seedLocation, keyLocation);
    return await vault.getSecp256k1EcdsaPublicKey(keyLocation);
})().then((value) => {
    const toHexString = (bytes) => bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
    console.log(toHexString(value))
});
