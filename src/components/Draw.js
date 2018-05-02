import React, { Component } from 'react';
import { SketchField, Tools } from 'react-sketch';
import { drawingsCollection, convertItemToDb, deconvertItemFromDb } from '../lib/firebase';

class Draw extends Component { 
    constructor(props) {
        super(props);

        this.sketchRef = React.createRef();

        this.state = {
        }

        this.itemsCount = 0;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.getItems(this.state).objects.length !== this.getItems(nextState).objects.length;
    }

    componentDidMount() {
        drawingsCollection
            .onSnapshot((snap) => {
                const addedItems = snap.docChanges.filter((change) => change.type === 'added');

                if (addedItems.length > 0) {
                    const items = addedItems
                        .reduce((acc, item) => {
                            return {
                                ...acc,
                                [item.doc.id]: deconvertItemFromDb(item.doc.data().item),
                            }
                        }, {});

                    this.setState({
                        ...this.state,
                        ...items,
                    });
                }
            });
    }

    getItems = (state) => {
        return {
            objects: Object.keys(state).map((key) => state[key])
        }
    }

    onSketchChange = (data) => {
        if (!data || data.type !== 'mouseup') {
            return false;
        }

        const objects = this.sketchRef.current.toJSON().objects

        if (this.itemsCount !== objects.length) {

            this.itemsCount = objects.length;

            const item = objects[objects.length -1];
            if (item) {
                drawingsCollection
                    .add({
                        item: convertItemToDb(item)
                    });
            }
        }
    }

    render() {
        return (
            <SketchField 
                className='paint-canvas'
                ref={this.sketchRef}
                forceValue={true}
                width="600px"
                height="300px"
                onChange={this.onSketchChange}
                value={this.getItems(this.state)}
                tool={Tools.Pencil} 
                lineColor={this.props.user.color}
                lineWidth={3}/>
        )
     }
}

export default Draw;