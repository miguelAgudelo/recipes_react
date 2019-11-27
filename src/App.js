import React from 'react';
import './assets/css/App.css';
import Router from './Router'
import Footer from './components/Footer';
/*const classes = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    backgroundColor: '#cfe8fc',
    height: '90vh',
    margin: '0px auto',
  }
}));*/
function App() {
  return (
    <div>
      <div className="App">
          {/*<RecipeSave />
          <RecipeList />*/}
          <Router/>
      </div>
      <Footer />
    </div>
  );
}

export default App;
