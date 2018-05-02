import React from 'react';
import styled from 'styled-components';

import Draw from './Draw';
import { Users } from './Users';

const PaintWrapper = styled.div`
    display: flex;
    flex-direction: row;
`

export const Paint = (props) => (
    <PaintWrapper>
        <Draw user={props.user}/>
        <Users user={props.user} />
    </PaintWrapper>
);