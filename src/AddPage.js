import React from 'react';

import crossImage from './icons/cross.svg';
import plusImage from './icons/plus.svg';
import cursorImage from './icons/cursor.svg';
import checkmarkImage from './icons/checkmark.svg';
import eyeImage from './icons/eye.svg';
import eyeoffImage from './icons/eyeoff.svg';
import trashImage from './icons/trash.svg';

class AddPage extends React.Component{
	constructor(props){
		super(props);
		this.state={
			newAdd: {
				title: "",
				type: "element",
				selectArr: {},
				parent: undefined
			},
			viewSelected: false,
			selectingElements: false,
			hasName: true,
			hasSelector: true
		}

		this.handleSelectClick = this.handleSelectClick.bind(this);
		this.handleViewClick = this.handleViewClick.bind(this);
		this.handleDeleteClick = this.handleDeleteClick.bind(this);
		this.handleAddClick = this.handleAddClick.bind(this);
		this.handleCancelClick = this.handleCancelClick.bind(this);
		this.handleNameInputChange = this.handleNameInputChange.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
	}

	componentDidMount() {
		const {editElement, parent} = this.props
		let newAdd = editElement ? {...editElement} : {...this.state.newAdd} 
		newAdd.parent = parent
		this.setState({
			newAdd
		})
  }

	handleViewClick(){
		this.setState(prevState => ({
			viewSelected: !prevState.viewSelected,
			selectingElements: false
		}))
	}

	handleSelectClick(){
		this.setState(prevState => ({
			selectingElements: !prevState.selectingElements,
			viewSelected: false
		}))
	}

	handleDeleteClick(){
		this.setState(prevState => ({
			selectingElements: false,
			viewSelected: false
		}))
	}

	handleAddClick(){
		const {newAdd} = this.state
		let hasName = true
		let hasSelector = true

		if(!newAdd.title.length > 0) hasName = false
		if(Object.keys(newAdd.selectArr).length === 0) hasSelector = false

		this.setState({
			hasSelector,
			hasName
		})
		if(hasName)
			this.props.onAddElement(newAdd)
	}

	handleCancelClick(){
		this.props.onCancelClick()
	}

	handleNameInputChange(e) {
		const title = e.target.value
		this.setState(prevState => ({
			newAdd: {
				...prevState.newAdd,
				title,
			},
			hasName: title.length > 0
		}))
	}

	handleSelectChange(e) {
		const type = e.target.value
		this.setState(prevState => ({
			newAdd: {
				...prevState.newAdd,
				type
			}
		}))
	}

	render(){
		const {newAdd, selectingElements, viewSelected, hasName, hasSelector} = this.state
		const {editElement, parent} = this.props
		return(
			<div className="page">
				<div className="page-head">
					<h1 className="title">{editElement ? "Изменение элемента" : "Новый элемент"}</h1>
				</div>
				<div className="list add">
					<label>Название</label>
					<input type="text" maxLength="12" value={newAdd.title} onChange={this.handleNameInputChange}/>
					<label>Выбор</label>
					<div className="select-block">
						<input type="text" disabled value={"Пусто"}/>
						<button className="button green" onClick={this.handleSelectClick}>
							<div className="icon">
								<img alt="" src={selectingElements ? checkmarkImage : cursorImage}/>
							</div>
						</button>
						<button className="button blue" onClick={this.handleViewClick}>
							<div className="icon">
								<img alt="" src={viewSelected ? eyeoffImage : eyeImage}/>
							</div>
						</button>
						<button className="button red" onClick={this.handleClearClick}>
							<div className="icon">
								<img alt="" src={trashImage}/>
							</div>
						</button>
					</div>
					<label>Тип</label>
					<div className="select">
						<select value={newAdd.type} onChange={this.handleSelectChange}>
							<option value="element">Element</option>
							<option value="text">Text</option>
							<option value="link">Link</option>
							<option value="image">Image</option>
						</select>
					</div>
					<label>Родитель</label>
					<input type="text" disabled value={parent ? parent.title : "Нет"}/>
					{(!hasName || !hasSelector) && 
						<div class="error">
							{!hasName && <p> - Введите название элемента</p>}
							{!hasSelector && <p> - Выберите элемент на странице</p>}
						</div>
					}
				</div>
				<div className="button-group">
					<button className="button fullwidth active" onClick={this.handleAddClick}>
						<div className="icon">
							<img alt="" src={plusImage}/>
						</div>
						<div className="text">{editElement ? "Изменить" : "Добавить"}</div>
					</button>
					<button className="button fullwidth" onClick={this.handleCancelClick}>
						<div className="icon">
							<img alt="" src={crossImage}/>
						</div>
						<div className="text">Отмена</div>
					</button>
				</div>
			</div>
		)
	}
}

export default AddPage;