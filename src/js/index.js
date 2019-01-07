import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements, renderLoader} from './views/base';
/*Global state of the app
    search object
    current recipe object
    shopping list object
    liked recipes
    */
const state = {

};
const controlSearch = async () => {
    // 1) get query from the view
    const query = searchView.getInput(); //TODO
    if (query) {
        // 2) new search object and add it to state
        state.search = new Search(query)
        // 3)prepare UI for the results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        // 4)search for recipies
        await state.search.getResults();
        // 5) render the results on the UI
        searchView.renderResults(state.search.result);
        //console.log(state.search.result);
    }
}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

