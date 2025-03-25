import { ExtensionContext,SecretStorage } from 'vscode';

let secrets: SecretStorage;

export function activate(context: ExtensionContext) {
    secrets=context.secrets;
   
}
 // Save a password
 export async function savePassword(key:string,password: string) {
    await secrets.store(key, password);
}

// Retrieve a password
export async function getPassword(key:string) {
    return await secrets.get(key);
}

// Delete a password
export async function deletePassword(key:string) {
    await secrets.delete(key);
}