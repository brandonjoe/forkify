import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import {elements, renderLoader, clearLoader, elementStrings} from './views/base';
/*Global state of the app
    search object
    current recipe object
    shopping list object
    liked recipes
    */
const state = {
};
window.state= state;
// search controller

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
        try{
            await state.search.getResults();
            // 5) render the results on the UI
            clearLoader();
            searchView.renderResults(state.search.result);
            //console.log(state.search.result);
        }
        catch(err){
            alert('Something went wrong with the search...')
            clearLoader();
            console.log(err);
        }
    }
}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});



elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage)
    }
}); 

//recipe controller
const controlRecipe = async () => {
    // we get the ID from the URL
    const id = window.location.hash.replace('#', '');
    if(id){
        //Prepare the ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        //highlight the selected
        if(state.search) searchView.highlightSelected(id);
        // create new recipe object
        state.recipe = new Recipe(id);
        // get recipe data
        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            // console.log(state.recipe.ingredients)
            // get Calctime and calcservings
            state.recipe.calcTime();
            state.recipe.calcServings();
            //render the recipe
            clearLoader();

            recipeView.renderRecipe(state.recipe);
    
        }
        catch(err){
            alert('API might be down!');
            console.log(err);
        }

    }
};
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


//list controller
const controlList = () => {
    //create a new list is there is none yet
    if(!state.list) state.list = new List();
    //add each ingredient to the list 
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};
//handle delete and update list item event
elements.shopping.addEventListener('click', e=>{
    const id = e.target.closest('.shopping__item').dataset.itemid;
    //handle the delete
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        //delete from the state and the user interface
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        
        
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }
    console.log(state.recipe);
});
// handling recipe button clicks
window.l = new List();