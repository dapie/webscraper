import React from 'react';
import blockImage from './icons/block.svg';
import textImage from './icons/text.svg';
import linkImage from './icons/link.svg';
import picImage from './icons/pic.svg';
import deleteButton from './icons/delete.svg';
import editButton from './icons/edit.svg';

class ListBlock extends React.Component{
	constructor(props){
		super(props);
		this.state={

		}

		this.handleDeleteClick = this.handleDeleteClick.bind(this)
		this.handleEditClick = this.handleEditClick.bind(this)
		this.handleListBlockClick = this.handleListBlockClick.bind(this)
	}

	handleEditClick(e){
		const {onBlockEdit, element} = this.props
		e.stopPropagation();
		onBlockEdit(element)
	}

	handleDeleteClick(e){
		const {onBlockDelete, element} = this.props
		e.stopPropagation();
		onBlockDelete(element.id)
	}

	handleListBlockClick(){
		const {onBlockClick, element} = this.props
		onBlockClick(element)
	}

	render(){
		let {element} = this.props
		const icons = {
			"element": ["blue", blockImage],
			"text": ["red", textImage],
			"link": ["green", linkImage],
			"image": ["purple", picImage],
		}
		return (
			<div className="list-block" onClick={this.handleListBlockClick}>
				<div className={"icon block " + icons[element.type][0]}>
					<img alt="" src={icons[element.type][1]}/>
				</div>     
				<div className="info">
					<h1 className="title">{this.props.element.title}</h1>
					<p className="type">{this.props.element.type}</p>
				</div>
				<div className="edit-button" onClick={this.handleEditClick}>
					<img alt="" src={editButton}/>
				</div>
				<div className="delete-button" onClick={this.handleDeleteClick}>
					<img alt="" src={deleteButton}/>
				</div>
			</div>
		)
	}
}

export default ListBlock;