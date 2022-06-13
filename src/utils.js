
// ==========HELPER FUNCTIONS==========
function getSearchParam(key) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
    return params[key]; 
}

function triggerJsonDownload(name, object) {
    const date = new Date().toJSON();
    const filename = `${name}-${date}.json`;
    
    let link = document.createElement('a');
    link.href = URL.createObjectURL(
        new Blob([JSON.stringify(object)],
        {type: "application/json"})
    );
    link.download = filename;
    link.click();
}

