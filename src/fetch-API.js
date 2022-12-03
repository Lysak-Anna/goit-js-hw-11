const axios = require('axios').default;

export default class FetchAPI {
    #MAIN_HTTP = 'https://pixabay.com/api/?key=31405972-7c23c7be60e1289f27e0f1942';
    constructor() {
        this.searchWord = '';
        this.page = 1;
        this.quantityOfPictures = 40;
        
    }
    async getImage() {
    try {
    const response = await axios.get(`${this.#MAIN_HTTP}&q=${this.searchWord}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`);
    return response;   
        
   } catch (error) {
    Notify.info('Please, try again in few minutes'); 
   }
    }
    incrementPage() {
        this.page += 1;
    }
    resetPage() {
        this.page = 1;
    }
    incrementQuantity() {
      return this.quantityOfPictures += 40;
    }
    resetQuantity() {
        this.quantityOfPictures = 40;
    }
    get word() {
        return this.searchWord;
    }

    set word(newWord) {
        this.searchWord = newWord;
    }
}