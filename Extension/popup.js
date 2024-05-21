// popup.js
const API_KEY = 'YOUR_API_KEY';

async function getVideoTitle(videoId) {
  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${API_KEY}`);
    const data = await response.json();
    const title = data.items[0].snippet.title;
    return title;
  } catch (error) {
    throw new Error(error);
  }
}
  document.addEventListener("DOMContentLoaded", function() {
    var getMarkButton = document.getElementById("mark");
    
    if (getMarkButton) {
      getMarkButton.addEventListener("click", function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          const marked_tab = tabs[0];
          
          if (marked_tab) {
            // Store the tab ID in local storage to mark the page
            localStorage.setItem('markedPage', marked_tab.id.toString());
            
            const markedTabId = localStorage.getItem('markedPage');

            chrome.tabs.get(parseInt(markedTabId), function(tab) {
              if (tab) {
                const tabUrl = tab.url;
                console.log('URL of the tab:', tabUrl);
                
                const video_id = tabUrl.slice(32);
                
                getVideoTitle(video_id)
                  .then(videoTitle => {
                    console.log('Video Title:', videoTitle);
                    // Use videoTitle as needed
                    fetch('http://localhost:5000/title', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({title: videoTitle}),
                  })
                  .then(response => console.log('Sucesso:', response))
                  .catch(error => console.error('Erro:', error));
                                    })
                  .catch(error => {
                    console.error('Error retrieving video title:', error);
                  });
              } else {
                console.error('Tab not found');
              }
            });
          } else {
            console.error('No active tab');
          }
        });
      });
    }
  });


chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVideoTitle') {
    const markedTabId = localStorage.getItem('markedPage');
    
    if (markedTabId) {
      chrome.tabs.get(parseInt(markedTabId), function(tab) {
        if (tab) {
          const markedPageUrl = tab.url;
          const video_id = markedPageUrl.slice(32);
          
          // Assuming getVideoTitle returns a Promise
          getVideoTitle(video_id)
            .then(videoTitle => {
              // Sending response inside the getVideoTitle's resolved promise
              sendResponse({ title: videoTitle });
            })
            .catch(error => {
              // Sending error if getVideoTitle encounters an error
              sendResponse({ error: 'Error fetching video title' });
            });
          
          // Ensuring sendResponse is used asynchronously
          return true;
        } else {
          sendResponse({ error: 'Tab not found' });
        }
      });
    } else {
      sendResponse({ error: 'Page not marked' });
    }

    // Returning true ensures sendResponse is used asynchronously
    return true;
  }
});

let requestMade = false;
let lastUrl = '';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tabId === parseInt(localStorage.getItem('markedPage'))) {
    // A guia marcada começou a carregar, então resetamos a variável 'requestMade'
    requestMade = false;
  }

  if (!requestMade && changeInfo.status === 'complete' && tabId === parseInt(localStorage.getItem('markedPage'))) {
    // A guia marcada terminou de carregar e nenhuma solicitação foi feita ainda, então enviamos a solicitação
    requestMade = true;
    chrome.tabs.get(tabId, function(tab) {
      if (tab) {
        const tabUrl = tab.url;
        console.log('URL of the tab:', tabUrl);
        
        const video_id = tabUrl.slice(32);
        
        getVideoTitle(video_id)
          .then(videoTitle => {
            console.log('Video Title:', videoTitle);
            // Use videoTitle as needed
            fetch('http://localhost:5000/title', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({title: videoTitle}),
          })
          .then(response => {
            console.log('Sucesso:', response);
            // Após a solicitação ser enviada, fazemos requestMade = false após 3 segundos
            setTimeout(() => {
              requestMade = false;
            }, 3000);
          })
          .catch(error => console.error('Erro:', error));
        })
        .catch(error => {
          console.error('Error retrieving video title:', error);
        });
      } else {
        console.error('Tab not found');
      }
    });
  }
});
      });
    } else {
      console.error("getElementById('getUrl') returned null. Element not found.");
    }
  }); */
