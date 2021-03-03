import React from 'react';

export default React.createContext({
    navbar: '',
    videos: [],
    vidResources: [],
    comments: [],
    users: [],
    tagsRef: [],
    vidTags: [],
    isAdmin: '',
    refreshState: () => {},
    toggleNav: () => {},
    setAdmin: () => {}
});