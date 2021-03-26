import React from 'react';

export default React.createContext({
    navbar: '',
    videos: [],
    vidResources: [],
    comments: [],
    users: [],
    tagsRef: [],
    vidTags: [],
    siteText: [],
    isAdmin: '',
    loading: '',
    refreshState: () => {},
    toggleNav: () => {},
    setAdmin: () => {}
});