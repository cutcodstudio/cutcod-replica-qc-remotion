import React from 'react';
import {Composition} from 'remotion';
import {Replica} from './replica';

export const Root: React.FC = () => (
  <Composition id="Replica" component={Replica} width={1920} height={1080} fps={30} durationInFrames={310}/>
);
