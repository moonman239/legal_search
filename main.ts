
import fetch from "node-fetch";
import { URL } from "url";
type User = {"id":string,"display_name":string,"auth_method":string}
async function login()
{
    const url = new URL("http://localhost:8000/auth/login/debug");
    url.searchParams.append("username","legal_search");
    const resp = await fetch(url,{
        headers: {"Accept":"application/json"}
    });

    if (!resp.ok)
        throw resp.statusText;
    const json = await resp.json();
    console.debug(JSON.stringify(json));
    const accessToken: string = json["access_token"]["access_token"];
    return accessToken;
    
}
// Function createChatSession
// creates a chat session
async function createChatSession(accessToken:string)
{
    const headers = {
        "Content-Type":"application/json",
        "Accept":"application/json",
        "Authorization":"Bearer " + accessToken
    };
    const url = new URL("http://localhost:8000/chats");
    const resp = await fetch(url,{
        headers: headers,
        method: "POST",
        body: "{}"
    });
    if (!resp.ok)
        throw resp.statusText + JSON.stringify(await resp.json());
    const json = await resp.json();
    return (json["id"] as string);
}
// Function getSearchTerms
// given the user's input, queries the AI for search terms
// related to the user's legal case.
async function getSearchTerms(chatID:string,userInput:string,accessToken: string): Promise<string> {
    console.debug("getting search terms");
    console.debug("chat ID: " + chatID);
    const prompt = "Give me a list of 10 Google Scholar search terms related to this case. " + userInput;
    const url = new URL("http://localhost:8000/chats/" + chatID + "/prompter_message");
    const resp = await fetch(url, {
        method:"POST",
        headers: {
            "Authorization":"Bearer " + accessToken,
            "Accept":"application/json",
            "Content-Type":"application/json"
        },
        body: JSON.stringify({content:prompt})
    
});
    const text = await resp.text();
    if (!resp.ok)
        throw new Error(text);
    const searchTerms = text;
    return searchTerms;
}


var accessToken = "";
login().then((_accessToken)=>{
    accessToken = _accessToken
    return createChatSession(_accessToken);
}).then((val)=>getSearchTerms(val,"A client was arrested based solely on the signaling of a drug dog. He was charged with possession of illegal contraband.",accessToken)).then((val)=>console.log(val));