// Background script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === 'pageReloaded') {
      // A página foi recarregada, enviar uma resposta de confirmação
      chrome.runtime.sendMessage({ type: 'pageReloadedResponse' });
    }
  });