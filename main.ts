
// Function getSearchTerms
// given the user's input, queries the AI for search terms
// related to the user's legal case.
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
async function getSearchTerms(accessToken:string,userInput: string)
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
    const json = await resp.json();
    if (!resp.ok)
        throw resp.statusText + JSON.stringify(json);
    
    console.debug(json)
    return (json as {"generated_text":string})["generated_text"];
}

login().then((token)=>getSearchTerms(token,"police use of drug dogs")).then((val)=>console.log(val));