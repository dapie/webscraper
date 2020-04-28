import React from 'react';
import arrowsImage from './icons/arrows.svg';
import backImage from './icons/back.svg';
import plusImage from './icons/plus.svg';
import ghostImage from './icons/ghost.svg';

class MainPage extends React.Component{
  constructor(props){
    super(props);
    this.state={

		}
		
		this.handleAddClick = this.handleAddClick.bind(this);
		this.handleBackClick = this.handleBackClick.bind(this);
		this.handleScrapClick = this.handleScrapClick.bind(this);
  }
  
	handleAddClick() {
		this.props.onAddClick()
	}

	handleBackClick() {
		const {parent, onBackClick} = this.props
		onBackClick(parent && parent.parent ? parent.parent.id : undefined)
	}

	handleScrapClick() {
		this.props.onScrapClick()
	}

	render(){
		const {listItems, parent, currentSite} = this.props
		return(
			<div className="page">
				<div className="page-head">
					<h1 className="title">Элементы</h1>
					<p className="description">{parent ? parent.type.toUpperCase() + " " + parent.title : currentSite}</p>
				</div>
				<div className={listItems.length > 0 ? "list" : "list empty"}>
					{listItems.length > 0 && listItems}
					<div className="empty-list">
						<img alt="" src={ghostImage}/>
						<p className="text">Пусто</p>
					</div>
				</div>
				<button className="button fullwidth" onClick={parent ? this.handleBackClick : this.handleScrapClick}>
					<div className="icon">
						<img alt="" src={parent ? backImage : arrowsImage}/>
					</div>
					<div className="text">{parent ? "Вернуться назад" : "Собрать информацию"}</div>
				</button>
				<button className="button fullwidth active" onClick={this.handleAddClick}>
					<div className="icon">
						<img alt="" src={plusImage}/>
					</div>
					<div className="text">Добавить элемент</div>
				</button>
			</div>
		)
	}
}

export default MainPage;