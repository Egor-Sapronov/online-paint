import React from 'react';
import styled from 'styled-components';

import Draw from './Draw';
import { Users } from './Users';

const PaintWrapper = styled.div`
    display: flex;
    flex-direction: row;

    .paint-canvas {
        border: 1px solid #cfd8dc;
    }
`

export const Paint = (props) => (
    <PaintWrapper>
        <Draw user={props.user}/>
        <Users user={props.user} />
    </PaintWrapper>
);