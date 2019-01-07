import axios from 'axios';
export default class Search{
    constructor(query){
        this.query = query;
    }
    async getResults(){
        const key = //'77c332f206b695e01e82c916c37844be'
        'c9136d8bba15bb62d1c12e834e6959f5'
        //'1ba16098d157ac39074c65aeb2073281';
        try{
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        }
        catch(error){
            alert(error);
        }
    }
}
