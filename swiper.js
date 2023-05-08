
let currentIndex = 0
let items = [];

var container = document.getElementById("main");
container.addEventListener('touchstart', function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});
container.addEventListener('touchend', function (event) {
    touchEndX = event.changedTouches[0].clientX;
    touchEndY = event.changedTouches[0].clientY;

    // calculate swipe direction
    let deltaX = touchEndX - touchStartX;
    let deltaY = touchEndY - touchStartY;

    // check which direction has greater distance and use that as the swipe direction
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
            console.log('swipe right');
            if (currentIndex > 0) {
                currentIndex--;
                showItem(currentIndex);
            }

        } else {
            console.log('swipe left');
            if (currentIndex < items.length - 1) {
                currentIndex++;
                showItem(currentIndex);
            } else {
                container.innerHTML = `<div style="text-align: center;display:flex; justify-content:center;align-items:center;font-size:48px;height: 100vh;" >No more articles</div>`;
            }
        }
    }
});

function showItem(index) {
    console.log(items[index])
    try {

        var container1 = document.getElementById("content");
        const item = items[index];

        const div = document.createElement('div');

        const datediv = document.createElement('p')
        const date = new Date(item.createdAt);
        const formattedDate = date.toLocaleString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
        datediv.innerHTML = `<p class="text-centre text-muted fw-bold">${formattedDate}</p>`;

        const title = document.createElement('div');
        title.innerHTML = `<h1 class="fw-bold mt-4 mb-2">${item.title}</h1>`;

        const subTitle = document.createElement('div');
        subTitle.innerHTML = `<p class="fw-bold mt-2 mb-2">${item.subtitle}</h1>`;


        let contentText = item.content ? item.content : ``;        

        const content = document.createElement('div');
        content.innerHTML = `<p class="mt-4">${contentText}</p>`;




        const imgsrc = document.createElement('img');
        let visual = item.imageUrl ? item.imageUrl : "wp.png"
        imgsrc.setAttribute('src', visual);
        imgsrc.setAttribute('alt', 'image');
        imgsrc.classList.add("mx-auto", "d-block");
        // mx-auto d-block

        const link = document.createElement('p');  
        let hostname = "";
        try {
            hostname = new URL(item.sourceUrl).hostname
        } catch {
            hostname = ""
        }

        // const favicon = document.createElement('img');
        // favicon.setAttribute('src', `https://www.google.com/s2/favicons?domain=${hostname}&sz=${36}`)

//         console.log(hostname);


        link.innerHTML = `<a href="${item.sourceUrl}" target="_blank">${item.sourceName}</a>`;
        link.className = 'small text-muted';

        const topDiv = document.createElement('div');
        topDiv.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${hostname}&sz=${64}" alt="Logo" height="24" class="d-inline-block align-text-center me-2"><a href="${item.sourceUrl}" target="_blank" class="text-muted">${item.sourceName}</a>`
        topDiv.className = 'mb-3';


        // div.appendChild(button);
        div.appendChild(topDiv);
        div.appendChild(imgsrc);
        div.appendChild(title);
        div.appendChild(subTitle);
        div.appendChild(datediv);
        div.appendChild(content);
        // div.appendChild(link);
        // div.appendChild(shareDiv);

        container1.innerHTML = '';
        container1.appendChild(div);


       

    } catch (err) {
        console.log(err.stack, err.message);
    }
}


getData();

async function getData() {
    items = [];
    currentIndex = 0;
    if (!getLocalStorage("swiper_inshorts")) {
        try {
            const response = await fetch(`https://sparkling-brook-0825.sixyjntpqun7805.workers.dev/`);
            const data = await response.json();
            setLocalStorage("swiper_inshorts", data, 15 * 60000);
            // console.log(data)
            items = data.sort((a, b) => b.createdAt - a.createdAt);
            showItem(0);
        } catch (error) {
            console.error(`${error.stack},${error.message}`);
        }
    } else {
        items = getLocalStorage("swiper_inshorts").sort((a, b) => b.createdAt - a.createdAt);
        showItem(0);
    }

}





