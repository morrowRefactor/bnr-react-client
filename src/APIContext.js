import React from 'react';

export default React.createContext({
    navbar: '',
    videos: [],
    vidResources: [],
    refreshState: () => {},
    toggleNav: () => {}
});