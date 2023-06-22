const showModal = document.getElementById('show-modal');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close-icon');
const bookMarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');
let bookmarks = [];
 
let modalOpen = false;
//Toggle Modal on and off
const toggleModal = () => {
    if(!modalOpen){
        modalOpen = true;
        modal.classList.toggle('show-modal');
        websiteNameEl.focus();
    } else {
        modalOpen = false;
        modal.classList.toggle('show-modal');
    }
}

//delete bookmark

//Vlaidate form Data

const validateform = (name, url) => {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regEx = new RegExp(expression);
    if(!name || !url){
        alert('Please submit values for both fields')
        return false;
    }
    if(!url.match(regEx)){
        alert('Please provide a valid web address');
        return false;
    }
    //Valid inputs
    return true;
}

//Build Bookmarks DOM

const buildBookmarks = () => {
    //Remove all dom elements are rebuild
    bookmarksContainer.textContent = '';
    bookmarks.forEach((bookmark) => {
        const { name, url } = bookmark;
        //Item
        const item = document.createElement('div');
        item.classList.add('item');
        //close icon
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('fa-solid', 'fa-trash-can');
        closeIcon.setAttribute('title', 'Delete Bookmark');
        closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
        //favicon / link container
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name');
        const favicon = document.createElement('img');
        favicon.setAttribute('src',`https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
        favicon.setAttribute('alt', 'favicon')
        const urlLink = document.createElement('a');
        urlLink.setAttribute('href', `${url}`);
        urlLink.setAttribute('target', '_blank');
        urlLink.textContent = name;
        //append to bookmarks container
        linkInfo.append(favicon,urlLink);
        item.append(closeIcon,linkInfo);
        bookmarksContainer.appendChild(item);
    });
}

//Fetch Bookmarks from local storage

const fetchBookmarks = () => {
    //Get Bookmarks from storage if avaliable
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'))
    } else {
        //Create bookmarks array in local storage
        bookmarks = [
            {
                name: 'YouTube',
                url: 'https://youtube.com'
            }
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
    }
    buildBookmarks();
}
//Delet bookmark

const deleteBookmark = (url) => {
    bookmarks.forEach((bookmark, index) => {
        console.log(bookmark);
        if(bookmark.url === url){
            bookmarks.splice(index, 1);
        }
    });
    //update bookmarks array in local storage and repopulate dom
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

//Handle data from form

const storeBookmark = (e) => {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://') && !urlValue.includes('https://')){
        urlValue = `https://${urlValue}`;        
    }
    if(!validateform(nameValue, urlValue)){
        return false;
    };
    const bookmark = {
        name: nameValue,
        url: urlValue
    }
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookMarkForm.reset();
    websiteNameEl.focus();
    toggleModal();
}



// Event Listeners
showModal.addEventListener('click', toggleModal);
closeModal.addEventListener('click', toggleModal);
window.addEventListener('click', (e) => e.target === modal ? modal.classList.remove('show-modal') : false)

bookMarkForm.addEventListener('submit', storeBookmark)

fetchBookmarks();