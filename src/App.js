import React from 'react';
import './App.css';
import MainPage from './MainPage';
import ListBlock from './ListBlock';
import AddPage from './AddPage';
/*global chrome*/

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      showAdd: false,
      editElement: undefined,
      elements: [],
      currentSite: undefined,
      parent: undefined
    }

    this.handleToggleAddClick = this.handleToggleAddClick.bind(this);
    this.handleElementAdd = this.handleElementAdd.bind(this);
    this.handleBlockClick = this.handleBlockClick.bind(this);
    this.handleBlockDelete = this.handleBlockDelete.bind(this);
    this.handleBlockEdit = this.handleBlockEdit.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
    this.handleScrapClick = this.handleScrapClick.bind(this);
  }

  componentDidMount() {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let tmp = document.createElement ('a');
        tmp.href = tabs[0].url;
        const oldElements = localStorage.getItem(tmp.hostname)
        this.setState({
          elements: oldElements ? JSON.parse(oldElements) : [],
          currentSite: tmp.hostname
        })
    });
  }

  handleToggleAddClick(){
    this.setState(prevState => ({
      editElement: undefined,
      showAdd: !prevState.showAdd,
    }))
  }

  handleScrapClick(){
    console.log("scrap")
  }

  handleBackClick(parentId){
    const el = this.state.elements.filter((el) => el.id === parentId)
    this.setState({
      parent: el.length > 0 ? el[0] : undefined
    })
  }

  getDeleteElements(id){
    let delElements = []
    let ids = [id]
    this.state.elements.forEach((el, arrId)=>{
      for(let checkId of ids) {
        if(checkId === el.id){
          delElements.push(arrId)
          break;
        } else if (el.parent && el.parent.id === checkId){
          ids.push(el.id)
          delElements.push(arrId)
          break;
        }
      }
    })
    return delElements
  }

  handleBlockDelete(id){
    let elements = [...this.state.elements]
    const deleteElements = this.getDeleteElements(id)
    for(let el of deleteElements.reverse()){
      elements.splice(el, 1)
    }
    this.setState({
      elements
    })
    localStorage.setItem(this.state.currentSite, JSON.stringify(elements))
  }

  handleBlockClick(element){
    this.setState({
      parent: element,
    })
  }

  handleBlockEdit(element){
    this.setState((prevState) => ({
      editElement: element,
      showAdd: !prevState.showAdd,
    }))
  }

  getElementId(){
    const idArray = this.state.elements.map((el) => el.id)
    if(idArray.length === 0) return 0
    else return Math.max(...idArray) + 1
  }

  handleElementAdd(element) {
    const {elements} = this.state
    let newElements = [...elements]
    if(element.id !== undefined){
      newElements.forEach((el, arrId)=>{
        if(el.id === element.id){
          newElements[arrId] = element
          return
        }
      })
    } else {
      element.id = this.getElementId()
      newElements.push(element)
    }
    this.setState({
      elements: newElements,
      showAdd: false
    })
    localStorage.setItem(this.state.currentSite, JSON.stringify(newElements))
  }

  render() {
    const filteredItems = this.state.elements.filter((el) => 
      this.state.parent === undefined  ? el.parent === undefined : el.parent && this.state.parent.id === el.parent.id
    )
    const listItems = filteredItems.map((element) =>
      <ListBlock 
        key={element.id} 
        element={element}
        onBlockClick={this.handleBlockClick}
        onBlockDelete={this.handleBlockDelete}
        onBlockEdit={this.handleBlockEdit}
      />
    );
    return (
      <div className="App">
        {!this.state.showAdd &&
          <MainPage 
            listItems={listItems}
            onAddClick={this.handleToggleAddClick}
            onBackClick={this.handleBackClick}
            onScrapClick={this.handleScrapClick}
            parent={this.state.parent}
            currentSite={this.state.currentSite}
          />
        }
        {this.state.showAdd &&
          <AddPage
            onAddElement={this.handleElementAdd}
            onCancelClick={this.handleToggleAddClick}
            editElement={this.state.editElement}
            parent={this.state.parent}
          />
        }
      </div>
    );
  }
}

export default App;