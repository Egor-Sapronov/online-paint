import React, { Component } from 'react';
import styled from 'styled-components';

import { drawingsCollection } from '../lib/firebase';
import Draw from './Draw';
import { Users } from './Users';

const PaintWrapper = styled.div`
    display: flex;
    flex-direction: row;

    .paint-canvas {
        border: 1px solid #cfd8dc;
        border-bottom: none;
    }
`

export class Paint extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paintCount: 1
        }
    }

    componentDidMount() {
        drawingsCollection
            .onSnapshot((snap) => {
                const deletedItems = snap.docChanges.filter((change) => change.type === 'removed');

                if (deletedItems.length > 0) {
                    this.resetPaint();
                }
            });
    }

    resetPaint = () => {
        this.setState({
            paintCount: this.state.paintCount + 1
        });
    }

    render() {
        return (
            <PaintWrapper>
                <Draw 
                    key={this.state.paintCount} 
                    user={this.props.user} 
                />
                <Users user={this.props.user} />
            </PaintWrapper>
        )
    }
}