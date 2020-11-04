const sendButton = document.getElementById('add')
const merchant = document.getElementById('merchant')
const password = document.getElementById('password')

function sendHttpRequest(method, url) {
  const promise = new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const merc = merchant.value
    const pass = password.value

    xhr.open(method, url);
    
    const xmlRequest = `
          <?xml version="1.0" encoding="UTF-8"?>
          <TKKPG>
            <Request>
              <Operation>CreateOrder</Operation>
              <Language>EN</Language>
              <Order>
                <OrderType>Purchase</OrderType>
                <Merchant>${merc}</Merchant>
                <Amount>2500</Amount>
                <Currency>944</Currency>
                <Description>test</Description>
                <ApproveURL>https://webhook.site/a2994a54-d055-4756-a007-94baa311653c</ApproveURL>
                <CancelURL>https://webhook.site/a2994a54-d055-4756-a007-94baa311653c</CancelURL>
                <DeclineURL>https://webhook.site/a2994a54-d055-4756-a007-94baa311653c</DeclineURL>
                  <AddParams>
                    <messageCategory>01</messageCategory>
                    <threeDSCompInd>N</threeDSCompInd>
                    <threeDSRequestorAuthenticationInd>01</threeDSRequestorAuthenticationInd>
                  </AddParams> 
              </Order>
            </Request>
          </TKKPG>
          `
    authData = sha256(sha256(xmlRequest) + "/" + sha256(merc + "/" + pass))

    xhr.setRequestHeader('AuthData', authData);

    xhr.onload = function () {
      resolve(xhr.response);
    };

    xhr.send();
  });

  return promise;
}

async function createPost() {
  sendHttpRequest('POST', 'http://test.millikart.az:7443/ExecPasswordAuth');
}

sendButton.addEventListener('click', (event) => {
  event.preventDefault()
  createPost()
})

async function sha256(message) {
  const msgBuffer = new TextEncoder('utf-8').encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
  return hashHex;
}