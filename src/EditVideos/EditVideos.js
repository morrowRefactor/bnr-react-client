import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Popup from 'reactjs-popup';
import AddVidTag from '../AddVidTag/AddVidTag';
import AddVidResource from '../AddVidResource/AddVidResource';
import ValidationError from '../ValidationError/ValidationError';
import TokenService from '../services/token-service';
import APIContext from '../APIContext';
import config from '../config';
import './EditVideos.css';

class EditVideos extends Component {
  static contextType = APIContext;

  constructor(props) {
    super(props)
    this.state = {
      currVid: {},
      currTagIds: [],
      currVidResos: [],
      videos: [],
      vidResources: { value: [], touched: false },
      tagsRef: [],
      vidTags: [],
      title: { value: '', touched: false },
      description: { value: '', touched: false },
      link: { value: '', touched: false },
      tags: { value: [], touched: false },
      tagCount: [],
      newTags: [],
      deletedResos: [],
      newResoCount: []
    };
  };

  updateState = () => {
    Promise.all([
      fetch(`${config.API_ENDPOINT}/api/videos`),
      fetch(`${config.API_ENDPOINT}/api/vid-resources`),
      fetch(`${config.API_ENDPOINT}/api/tags`),
      fetch(`${config.API_ENDPOINT}/api/vid-tags`)
    ])
    .then(([vidRes, vidResoRes, tagsRes, vidTagsRes]) => {
      if (!vidRes.ok)
        return vidRes.json().then(e => Promise.reject(e));
      if (!vidResoRes.ok)
        return vidResoRes.json().then(e => Promise.reject(e));
      if (!tagsRes.ok)
        return tagsRes.json().then(e => Promise.reject(e));
      if (!vidTagsRes.ok)
        return vidTagsRes.json().then(e => Promise.reject(e));
      return Promise.all([vidRes.json(), vidResoRes.json(), tagsRes.json(), vidTagsRes.json()]);
    })
    .then(([videos, vidResources, tags, vidTags]) => {
      const thisVid = videos.find(({ id }) => id === parseInt(this.props.match.params.vid));

      let thisVidTags = [];
      for(let i = 0; i < vidTags.length; i++) {
        if(vidTags[i].vid_id === parseInt(this.props.match.params.vid)) {
          thisVidTags.push(vidTags[i].tag_id);
        }
      }
      
      let vidResos = [];
      for(let i = 0; i < vidResources.length; i++) {
        if(vidResources[i].vid_id === parseInt(this.props.match.params.vid)) {
          vidResos.push(vidResources[i]);
        }
      }

      this.setState({
        currVid: thisVid,
        currTagIds: thisVidTags,
        currVidResos: vidResos,
        videos: videos,
        vidResources: { value: vidResos, touched: false },
        tagsRef: tags,
        vidTags: vidTags
      })
    })
    .catch(error => {
      console.error({error});
    });
  }

  componentDidMount() {
    if(this.context.comments.length < 1) {
        this.updateState();
    }
    else {
        const thisVid = this.context.videos.find(({ id }) => id === parseInt(this.props.match.params.vid));

        let thisVidTags = [];
        for(let i = 0; i < this.context.vidTags.length; i++) {
          if(this.context.vidTags[i].vid_id === parseInt(this.props.match.params.vid)) {
            const addTag = thisVidTags;
            addTag.push(this.context.vidTags[i].tag_id)
            thisVidTags = addTag;
          }
        }

        let vidResos = [];
        for(let i = 0; i < this.context.vidResources.length; i++) {
          if(this.context.vidResources[i].vid_id === parseInt(this.props.match.params.vid)) {
            vidResos.push(this.context.vidResources[i]);
          }
        }

        this.setState({
            currVid: thisVid,
            currTagIds: thisVidTags,
            currVidResos: vidResos,
            videos: this.context.videos,
            vidResources: { value: vidResos, touched: false },
            tagsRef: this.context.tagsRef,
            vidTags: this.context.vidTags
        });
    }
  }

  // update component state with form input values
  updateTitle(title) {
    this.setState({title: {value: title, touched: true}});
  };

  updateDesc(desc) {
    this.setState({description: {value: desc, touched: true}});
  };

  updateLink(link) {
    this.setState({link: {value: link, touched: true}});
  };

  updateTags(tag) {
    let tagsIDs = [];
    const tags = document.getElementsByName('tags');
    for (let checkbox of tags) {
      if (checkbox.checked)
        tagsIDs.push(parseInt(checkbox.value))
    }

    this.setState({
      tags: { value: tagsIDs, touched: true }
    })
  };

  addTag = () => {
    if(this.state.tagCount.length < 1) {
      this.setState({
        tagCount: [ 1 ]
      });
    }
    else {
      let newCount = this.state.tagCount;
      newCount.push(newCount.length + 1);
      
      this.setState({
        tagCount: newCount
      });
    }
  };

  removeVidTag = id => {
    const arr = this.state.tagCount;
    const indy = arr.indexOf(id);
    if(indy > -1) {
      arr.splice(indy, 1);
    }
    this.setState({
      tagCount: arr
    });
  };

  addResource = () => {
    if(this.state.newResoCount.length < 1) {
      this.setState({
        newResoCount: [ 1 ]
      });
    }
    else {
      let newCount = this.state.newResoCount;
      newCount.push(newCount.length + 1);
      
      this.setState({
        newResoCount: newCount
      });
    }
  };

  removeVidResource = id => {
    for(let i = 0; i < this.state.vidResources.value.length; i++) {
      if(this.state.vidResources.value[i].id === parseInt(id)) {
        const newArr = this.state.vidResources.value;
        newArr.splice(i, 1);
        this.setState({
          vidResources: { value: newArr, touched: true }
        });
      }
    }
  };

  removeNewVidReso = id => {
    const arr = this.state.newResoCount;
    const indy = arr.indexOf(id);
    if(indy > -1) {
      arr.splice(indy, 1);
    }
    this.setState({
      newResoCount: arr
    });
  }

  //validate form field inputs
  validateTitle() {
    const title = this.state.title.value.trim();
    if (title.length === 0) {
      return 'A video title is required';
    };
  };

  validateDesc() {
    const desc = this.state.description.value.trim();
    if (desc.length === 0) {
      return 'A video description is required';
    };
  };

  validateLink() {
    const link = this.state.link.value.trim();
    if (link.includes('youtube')) {
      return `The link should only include the YouTube ID (ex: cywyb3Y6Qxg)`;
    };
    if (link.length === 0) {
      return 'A YouTube embed link is required';
    };
  };

  validateTags() {
    const tags = this.state.tags.value;
    if (tags.length === 0) {
      return 'At least one relevant topic tag is required';
    };
  };

  handleSubmit = () => {
    // handle any new tags added
    if(this.state.tagCount.length > 0) {
      for(let i = 0; i < this.state.tagCount.length; i++) {
        const id = this.state.tagCount[i];
        const tag = document.getElementById(`newTag[${id}]`);
        if(tag.value.length > 0) {
          let newTagsArr = this.state.newTags;
          newTagsArr.push(tag.value);
          this.setState({
            newTags: newTagsArr
          });
        }
      }
        
      fetch(`${config.API_ENDPOINT}/api/tags`, {
        method: 'POST',
        body: JSON.stringify(this.state.newTags),
        headers: {
          'content-type': 'application/json',
          'authorization': `bearer ${TokenService.getAuthToken()}`
        }
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(error => {
              throw error
            })
          }
          return res.json();
        })
        .then(newTags => {
          this.secondarySubmit(newTags);
        })
        .catch(error => {
          this.setState({ error })
        })
    }
    else {
      this.secondarySubmit();
    }
  };

  secondarySubmit = (newTags) => {
    let totalUpdates = 0;

    // update video info if edited
    let editedVid = this.context.videos.find(({ id }) => id === parseInt(this.props.match.params.vid));

    if(this.state.title.touched === true || this.state.description.touched === true || this.state.link.touched === true) {
      totalUpdates++;
    }
    if(this.state.title.touched === true) {
      editedVid.title = this.state.title.value;
    }
    if(this.state.description.touched === true) {
      editedVid.description = this.state.description.value;
    }
    if(this.state.link.touched === true) {
      editedVid.link = this.state.link.value;
    }

    // update video tags
    let delTags = [];
    let addTags = [];
    if(this.state.tags.touched === true) {
      totalUpdates++;
      this.state.currTagIds.forEach(tag => {
        const tagCheck = this.state.tags.value.find(id => id === tag);
        if(!tagCheck) {
            for(let i = 0; i < this.context.vidTags.length; i++) {
              if(this.context.vidTags[i].vid_id === this.state.currVid.id && this.context.vidTags[i].tag_id === tag) {
                delTags.push(this.context.vidTags[i].id);
              }
            }
        }
      });
    }

    if(this.state.tags.touched === true) {
      this.state.tags.value.forEach(tag => {
        const tagCheck = this.state.currTagIds.find(id => id === tag);
        if(!tagCheck) {
          const newTag = {
            vid_id: this.state.currVid.id,
            tag_id: tag
          };

          addTags.push(newTag);
        }
      })
    }

    if(newTags) {
      totalUpdates++;
      newTags.forEach(tag => {
        const newTag = {
          vid_id: this.state.currVid.id,
          tag_id: tag
        };

        addTags.push(newTag);
      })
    }
    
    // update video resources
    let addResources = [];
    if(this.state.newResoCount.length > 0) {
      totalUpdates++;
      this.state.newResoCount.forEach(res => {
        const description = document.getElementById(`resDesc[${res}]`);
        const link = document.getElementById(`resLink[${res}]`);
        const newVidRes = {
          vid_id: this.state.currVid.id,
          description: description.value,
          link: link.value
        };

        addResources.push(newVidRes);
      })
    }
    if(this.state.deletedResos.length > 0) {
      totalUpdates++;
    }
    
    let resCheck = 0;
    if(this.state.title.touched === true || this.state.description.touched === true || this.state.link.touched === true) {
      fetch(`${config.API_ENDPOINT}/api/videos/${this.state.currVid.id}`, {
        method: 'PATCH',
        body: JSON.stringify(editedVid),
        headers: {
          'content-type': 'application/json',
          'authorization': `bearer ${TokenService.getAuthToken()}`
        }
      })
      .then(res => {
        resCheck++;
        if(resCheck === totalUpdates) {
          this.context.refreshState();
          this.props.history.push(`/videos/${this.state.currVid.id}`);
        }
      });
    }
    if(addTags.length > 0) {
      fetch(`${config.API_ENDPOINT}/api/vid-tags`, {
        method: 'POST',
        body: JSON.stringify(addTags),
        headers: {
          'content-type': 'application/json',
          'authorization': `bearer ${TokenService.getAuthToken()}`
        }
      })
      .then(res => {
        resCheck++;
        if(resCheck === totalUpdates) {
          this.context.refreshState();
          this.props.history.push(`/videos/${this.state.currVid.id}`);
        }
      });
    }
    if(delTags.length > 0) {
      fetch(`${config.API_ENDPOINT}/api/vid-tags`, {
        method: 'DELETE',
        body: JSON.stringify(delTags),
        headers: {
          'content-type': 'application/json',
          'authorization': `bearer ${TokenService.getAuthToken()}`
        }
      })
      .then(res => {
        resCheck++;
        if(resCheck === totalUpdates) {
          this.context.refreshState();
          this.props.history.push(`/videos/${this.state.currVid.id}`);
        }
      });
    }
    if(this.state.deletedResos.length > 0) {
      fetch(`${config.API_ENDPOINT}/api/vid-resources`, {
        method: 'DELETE',
        body: JSON.stringify(this.state.deletedResos),
        headers: {
          'content-type': 'application/json',
          'authorization': `bearer ${TokenService.getAuthToken()}`
        }
      })
      .then(res => {
        resCheck++;
        if(resCheck === totalUpdates) {
          this.context.refreshState();
          this.props.history.push(`/videos/${this.state.currVid.id}`);
        }
      });
    }
    if(addResources.length > 0) {
      fetch(`${config.API_ENDPOINT}/api/vid-resources`, {
        method: 'POST',
        body: JSON.stringify(addResources),
        headers: {
          'content-type': 'application/json',
          'authorization': `bearer ${TokenService.getAuthToken()}`
        }
      })
      .then(res => {
        resCheck++;
        if(resCheck === totalUpdates) {
          this.context.refreshState();
          this.props.history.push(`/videos/${this.state.currVid.id}`);
        }
      });
    }
    this.props.history.push(`/videos/${this.state.currVid.id}`);
  };

  handleDelete = () => {
    fetch(`${config.API_ENDPOINT}/api/videos/${this.props.match.params.vid}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            throw error
          })
        }
        
        this.context.refreshState();
        this.props.history.push(`/browse-videos`);
      })
      .catch(error => {
        this.setState({ error })
      })
  };

  deletePopup = () => (
    <Popup trigger={<button type='button' className='userProfileDelete' id='deleteButton'> Delete Video </button>} modal nested>
      {close => (
        <div className="modal">
            <button className="close" onClick={close}>
            &times;
            </button>
            <div className="header"> Delete Video </div>
            <div className="content">
             {' '}
                Are you sure you want to delete this video?
            </div>
            <div className="actions">
                <button 
                    className="button" 
                    onClick={() => this.handleDelete()}
                > 
                        Yes, delete 
                </button>
                <button
                    className="button"
                    onClick={() => close()}
                >
                    Cancel
                </button>
            </div>
        </div>
        )}
    </Popup>
);

  handleClickCancel = () => {
    this.props.history.push('/');
  };

  // pre-check select options for tags related to this video
  renderTags = tagID => {
    const findTag = this.state.currTagIds.find(id => id === tagID);
    const checkedTag = this.state.tags.value.find(id => id === tagID);
    if(findTag && !checkedTag && this.state.tags.touched === false) {
      return true;
    }
    if(findTag && !checkedTag && this.state.tags.touched === true) {
      return false;
    }
    if(findTag && this.state.tags.touched === false) {
      return true;
    }
    if(findTag && checkedTag) {
      return true;
    }
    if(!findTag && checkedTag) {
      return true
    }
    else {
      return false;
    }
  }

  render() {
    const thisVideo = this.context.videos.find(({ id }) => id === parseInt(this.props.match.params.vid)) || {};
    const titleError = this.validateTitle();
    const descError = this.validateDesc();
    const linkError = this.validateLink();
    const tagsError = this.validateTags();
    const newTags = this.state.tagCount.map(tag => 
      <AddVidTag
          key={tag}
          id={tag}
          removeTag={this.removeVidTag}
      />
    );

    const newResources = this.state.newResoCount.map(res => 
      <AddVidResource
          key={res}
          id={res}
          removeReso={this.removeNewVidReso}
      />
    );

    return (
        <section className='AdminVideos'>
            <h1 className='adminVideosHeader'>Edit {thisVideo.title}</h1>
            <form 
                className='AdminVideos_form'
            >
                <label htmlFor='vidTitle'>
                    Video title
                </label>
                <section className='adminVideos_formInput'>
                  <input
                      type="text"
                      id="vidTitle"
                      defaultValue={thisVideo.title}
                      onChange={e => this.updateTitle(e.target.value)}
                      required
                  />
                  {this.state.title.touched && (
                      <ValidationError message={titleError} />
                  )}
                </section>
                <label htmlFor='vidDesc'>
                    Video description
                </label>
                <section className='adminVideos_formInput'>
                  <input
                      type="textarea"
                      id="vidDesc"
                      defaultValue={thisVideo.description}
                      onChange={e => this.updateDesc(e.target.value)}
                      required
                  />
                  {this.state.description.touched && (
                      <ValidationError message={descError} />
                  )}
                </section>
                <label htmlFor='ytLink'>
                    YouTube link
                </label>
                <section className='adminVideos_formInput'>
                  <input
                      type="text"
                      id="ytLink"
                      defaultValue={thisVideo.youtube_id}
                      onChange={e => this.updateLink(e.target.value)}
                      required
                  />
                  {this.state.link.touched && (
                      <ValidationError message={linkError} />
                  )}
                </section>
                <label htmlFor='tagsRef'>
                        Video tags
                </label>
                <section className='adminVideos_formInput'>
                  {this.state.tagsRef.map(type =>
                    <section className='tagsRef_select'>
                      <input value={type.id} key={type.id} type='checkbox' name='tags' checked={this.renderTags(type.id)} onChange={e => this.updateTags(e.target.value)}/>
                      <label htmlFor={type.id} >{type.tag}</label>
                    </section>
                  )}
                  {newTags}
                  <button type='button' className='editVideosAddTags' onClick={() => this.addTag()}>Add Tag</button>
                  {this.state.tags.touched && (
                      <ValidationError message={tagsError} />
                  )}
                </section>
                <section className='adminVideo_formInput'>
                  Video Resources
                  {this.state.vidResources.value.map(res =>
                    <section className='vidReso_select'>
                      <label htmlFor={res.id} >{res.description}</label>
                      <p>{res.link}</p>
                      <input value={res.id} key={res.id} type='checkbox' name='tags' onChange={e => this.removeVidResource(e.target.value)}/> <span className='editVidRemoveReso'>Delete this resource</span>
                    </section>
                  )}
                  {newResources}
                  <button type='button' className='editVideosAddResos' onClick={() => this.addResource()}>Add Resource</button>
                </section>
                <div className='EditVideosForm_buttons'>
                    <button 
                        type='button'
                        onClick={() => this.handleSubmit()}
                    >
                        Submit Changes
                    </button>
                    {' '}
                    <button type='button' onClick={() => this.handleClickCancel()}>
                        Cancel
                    </button>
                    {' '}
                    {this.deletePopup()}
                </div>
            </form>
        </section>
    );
  };
};

export default withRouter(EditVideos);
