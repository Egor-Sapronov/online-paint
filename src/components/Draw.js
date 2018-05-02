import React, { Component } from 'react';
import { SketchField, Tools } from 'react-sketch';
import styled from 'styled-components';

import { drawingsCollection, convertItemToDb, deconvertItemFromDb } from '../lib/firebase';

const DrawWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const ClearButton = styled.button`
    background-color: #ff5252;
    color: #fff;
    height: 30px;
    font-weight: 600;
    border: none;
`;

class Draw extends Component { 
    constructor(props) {
        super(props);

        this.sketchRef = React.createRef();

        this.state = {
        }

        this.itemsCount = 0;

        this.drawsUnsubscribe = null
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.getItems(this.state).objects.length !== this.getItems(nextState).objects.length;
    }

    componentDidMount() {
        this.drawsUnsubscribe = drawingsCollection
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

    componentWillUnmount() {
        this.drawsUnsubscribe();
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

    onClear = () => {
        Object.keys(this.state).forEach((key) => {
            drawingsCollection.doc(key).delete();
        });
    }

    render() {
        return (
            <DrawWrapper>
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
                <ClearButton onClick={this.onClear}>Clear</ClearButton>
            </DrawWrapper>
        )
     }
}

export default Draw;