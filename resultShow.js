const API_KEY = "AIzaSyBtKgQaj1AHUEkJ5bjhqagVdA5T2LOn_PA";
const BASE_URL = "https://www.googleapis.com/youtube/v3";
const input = document.getElementById("search-input");
const mainDiv = document.getElementById('result-container');
input.value = localStorage.getItem("userSearchedContent");

async function displayResult() {
    let fetchedResult = await fetchVideos(input.value, 25);
    let searchedResult = fetchedResult.items;

    // Fetch channel results
    let channelResult = await fetchChannels(input.value);

    if (channelResult.items.length > 0) {
        // Channel found
        const channelId = channelResult.items[0].id.channelId;
        let channelDetails = await fetchChannelLogo(channelId);

        renderUi(true, channelDetails, searchedResult);
    } else {
        // Handle video search results if no channel is found
        renderUi(false, null, searchedResult);
    }
}

displayResult();

function renderUi(isChannelFound, channelDetails, searchedResult) {
    // Clear previous results
    mainDiv.innerHTML = '';
   
    // Render the channel block if a channel is found
    if (isChannelFound && channelDetails) {
        
        const channelDiv = document.createElement('div');
        channelDiv.className = "channel-container";
        
        const logoDiv = document.createElement('div');
        logoDiv.className = "logo-container";
        
        const contentDiv = document.createElement("div");
        contentDiv.className = "content-container";
        contentDiv.innerHTML = `
            <h2 class="channel-title">${channelDetails.items[0].snippet.title}</h2>
            <span class="sec-channel-title">${channelDetails.items[0].snippet.customUrl}</span>
            <span class="sec-channel-title">${ formatNumber(channelDetails.items[0].statistics.subscriberCount )} subscribers</span>
            <p class="summary-description">${channelDetails.items[0].snippet.description.slice(0, 150)}...</p>
        `;

        const channelLogo = document.createElement('div');
        channelLogo.className = "image-holder";
        channelLogo.style.background = `url(${channelDetails.items[0].snippet.thumbnails.high.url}) no-repeat center center/cover`;

        logoDiv.append(channelLogo);
        channelDiv.append(logoDiv);
        channelDiv.append(contentDiv);
        
        
        mainDiv.append(channelDiv);
    }

    searchedResult
        .filter(video => video.id.videoId)  
        .forEach(async (video) => {
            console.log(video);
            let channelLogo=await fetchChannelLogo(video.snippet.channelId)
            let channelLogoPicUrl=channelLogo.items[0].snippet.thumbnails.default.url


            const videoDiv = document.createElement("div");
            videoDiv.className = "channel-container";
            
            
            const videoLogo = document.createElement('div');
            videoLogo.className = 'logo-container';
            
            const videoTitleContainer = document.createElement('div');
            videoTitleContainer.className = 'content-container';
            
            
            const videoThumbnail = document.createElement('div')
            videoThumbnail.className = "video-holder";
            videoThumbnail.style.background = `url(${video.snippet.thumbnails.high.url}) no-repeat center center/cover`

            videoTitleContainer.innerHTML = `
                <h2 class="video-title">${video.snippet.title}</h2>
                <img src=${channelLogoPicUrl}>
                <span class="video-channel-title">${video.snippet.channelTitle}</span>
                <div class="video-description">${video.snippet.description}</div>
            `
            videoLogo.append(videoThumbnail);

            videoDiv.append(videoLogo);
            videoDiv.append(videoTitleContainer);

            

            mainDiv.append(videoDiv);
            videoDiv.addEventListener('click', () => {
                localStorage.setItem("selectedVideoId", video.id.videoId);
                
            });
        });
}




function formatNumber(number) {
    if (number >= 1000000000) {
        // Billions
        return roundToTwoDecimals(number / 1000000000) + 'B';
    } else if (number >= 1000000) {
        // Millions
        return roundToTwoDecimals(number / 1000000) + 'M';
    } else if (number >= 1000) {
        // Thousands
        return roundToTwoDecimals(number / 1000) + 'K';
    } else {
        // Less than a thousand
        return number.toString();
    }
}

function roundToTwoDecimals(num) {
    return Math.round(num * 100) / 100;
}



























async function fetchVideos(searchQuery, maxResults) {
    try {
        const response = await fetch(
            BASE_URL +
            "/search" +
            `?key=${API_KEY}` +
            `&part=snippet` +
            `&q=${searchQuery}` +
            `&maxResults=${maxResults}`
        );
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

async function fetchChannels(searchQuery) {
    try {
        const response = await fetch(
            BASE_URL +
            "/search" +
            `?key=${API_KEY}` +
            `&part=snippet` +
            `&q=${searchQuery}` +
            `&type=channel`
        );
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}

async function fetchChannelLogo(channelId) {
    try {
        const response = await fetch(
            BASE_URL +
            "/channels" +
            `?key=${API_KEY}` +
            `&part=snippet,statistics` +
            `&id=${channelId}`
        );
        const data = await response.json();
        return data;
    } catch (e) {
        console.log(e);
    }
}


// // BASE_URL/videos=>views/duration
// // typeOfDetails=> "contentDetails"=>duration
// // typeOfDetails=> "statistics"=>viewCount

async function fetchVideoStats(videoId,typeOfDetails){
    try{
        const response=await fetch(
            BASE_URL+
            "/videos"+
            `?key=${API_KEY}`+
            `&part=${typeOfDetails}`+
            `&id=${videoId}`
        )
        const data= await response.json()
        console.log(data)
    }
    catch(e){
        console.log(e)
    }
}
