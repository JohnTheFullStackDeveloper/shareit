let list = [];
function download(even) {
  if (list.indexOf(even) != -1) {
    alert("already downloading this file");
  } else {
    list.push(even);
    document.getElementById("loadingfiles").innerHTML =
      document.getElementById("loadingfiles").innerHTML +
      `<div class="loadingfileschilds" id="child${even.id}"><div class="l" id="${even.id}"></div></div>`;
    alert("wait downloading");
    document.getElementById(even.id).style.disabled = false;
    let url = even.id;
    let filename = even.innerText;
    filename = filename.slice(0, -1);
    const xhr = new XMLHttpRequest();
    xhr.responseType = "blob";
    xhr.onload = (e) => {
      console.log("starting downloading");
      const blob = xhr.response;
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    };
    xhr.onprogress = (ev) => {
      let percentage = (ev.loaded / ev.total) * 100;
      if (percentage >= 100) {
        const indexToRemove = list.findIndex((item) => item == even);
        if (indexToRemove !== -1) {
          list.splice(indexToRemove, 1);
        }
        document.getElementById(`child${even.id}`).remove();
      }
      document.getElementById(even.id).style.width = `${percentage}%`;
    };
    xhr.open("GET", url);
    xhr.send();
  }
}
