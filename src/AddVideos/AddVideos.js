import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import TokenService from '../services/token-service';
import AddVidResource from '../AddVidResource/AddVidResource';
import AddVidTag from '../AddVidTag/AddVidTag';
import ValidationError from '../ValidationError/ValidationError';
import config from '../config';
import './AddVideos.css';

class AddVideos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videos: [],
      vidResources: [],
      tags: [],
      tagsRef: [],
      vidTags: [],
      title: { value: '', touched: false },
      description: { value: '', touched: false },
      link: { value: '', touched: false },
      date: { value: '', touched: false },
      tags: { value: [], touched: false },
      vidRes: { value: [], touched: false },
      resCount: [ 1 ],
      tagCount: [ ],
      vidTags: [],
      newTags: [],
      allTags: [],
      tagsError: { value: '', status: false }
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
      this.setState({
        videos: videos,
        vidResources: vidResources,
        tagsRef: tags,
        vidTags: vidTags
      })
    })
    .catch(error => {
      console.error({error});
    });
  }

  componentDidMount() {
    this.updateState();
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

  updateDate(date) {
    this.setState({date: {value: date, touched: true}});
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
    if (link.length > 15) {
      return `The link should only contain the video ID in the YouTube URL (ex: just submit 'cywyb3Y6Qxg', rather than https://www.youtube.com/cywyb3Y6Qxg)`;
    };
    if (link.length === 0) {
      return 'A YouTube video ID is required';
    };
  };

  validateDate() {
    const date = this.state.date.value.trim();
    if (date.length === 0) {
      return 'A posted date is required';
    };
  };

  // package form input values before passing to the POST function
  handleSubmit = () => {
    if(this.state.tags.value.length < 1 && this.state.tagCount.length < 1) {
      this.setState({
        tagsError: { value: 'At least one relevant topic tag is required', status: true }
      })
    }
    else {
      this.initialSubmit();
    }
  }

  // first POST the new video and tags before submitting the rest of the data
  initialSubmit = () => {
    const newVideo = {
      title: this.state.title.value,
      description: this.state.description.value,
      youtube_id: this.state.link.value,
      date_posted: this.state.date.value 
    };

    // if new tags were provided with video, post as well
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

      Promise.all([
        fetch(`${config.API_ENDPOINT}/api/videos`, {
          method: 'POST',
          body: JSON.stringify(newVideo),
          headers: {
            'content-type': 'application/json',
            'authorization': `bearer ${TokenService.getAuthToken()}`
          }
        }),
        fetch(`${config.API_ENDPOINT}/api/tags`, {
          method: 'POST',
          body: JSON.stringify(this.state.newTags),
          headers: {
            'content-type': 'application/json',
            'authorization': `bearer ${TokenService.getAuthToken()}`
          }
        })
      ])
      .then(([vidRes, tagsRes]) => {
        if (!vidRes.ok)
          return vidRes.json().then(e => Promise.reject(e));
        if (!tagsRes.ok)
          return tagsRes.json().then(e => Promise.reject(e));
        return Promise.all([vidRes.json(), tagsRes.json()]);
        })
      .then(([newVid, newTags]) => {
          this.secondarySubmit(newVid, newTags);
      })
      .catch(error => {
        console.error({error});
      });
    }
    else {
      fetch(`${config.API_ENDPOINT}/api/videos`, {
        method: 'POST',
        body: JSON.stringify(newVideo),
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
        .then(newVid => {
          this.secondarySubmit(newVid);
        })
        .catch(error => {
          this.setState({ error })
        })
    }
  };

  // once the new video and tags are posted to db, all additional video data can be submitted
  secondarySubmit = (newVid, newTags) => {
    // populate video resources array
    const resourceCheck = document.getElementById(`resLink[1]`);
    if(resourceCheck.value.length > 1) {
      for(let i = 0; i < this.state.resCount.length; i++) {
        const id = this.state.resCount[i];
        const description = document.getElementById(`resDesc[${id}]`);
        const link = document.getElementById(`resLink[${id}]`);
        const newVidRes = {
          vid_id: newVid.id,
          description: description.value,
          link: link.value
        };
        let newVidResArr = this.state.vidRes.value;
        newVidResArr.push(newVidRes)
        this.setState({
          vidRes: { value: newVidResArr, touched: true }
        })
      }
    }

    // populate new tags array
    if(this.state.tagCount.length > 0) {
      for(let i = 0; i < newTags.length; i++) {
        const newVidTag = {
          vid_id: newVid.id,
          tag_id: newTags[i]
        };

        let newTagArr = this.state.allTags;
        newTagArr.push(newVidTag);
        this.setState({
          allTags: newTagArr
        });
      }
    }

    // combine any new tags with other selected tags
    if(this.state.tags.value.length > 0) {
      this.state.tags.value.forEach(tag => {
        const newTag = {
          vid_id: newVid.id,
          tag_id: tag
        };

        let newTagArr = this.state.allTags;
        newTagArr.push(newTag);
        this.setState({
          allTags: newTagArr
        });
      })
    }
    
    // POST new video data
    if(resourceCheck.value.length > 1) {
      Promise.all([
        fetch(`${config.API_ENDPOINT}/api/vid-tags`, {
          method: 'POST',
          body: JSON.stringify(this.state.allTags),
          headers: {
            'content-type': 'application/json',
            'authorization': `bearer ${TokenService.getAuthToken()}`
          }
        }),
        fetch(`${config.API_ENDPOINT}/api/vid-resources`, {
          method: 'POST',
          body: JSON.stringify(this.state.vidRes.value),
          headers: {
            'content-type': 'application/json',
            'authorization': `bearer ${TokenService.getAuthToken()}`
          }
        })
      ])
      .then(([tagRes, resoRes]) => {
        if (!tagRes.ok)
          return tagRes.json().then(e => Promise.reject(e));
        if (!resoRes.ok)
          return resoRes.json().then(e => Promise.reject(e));
        return Promise.all([tagRes.json(), resoRes.json()]);
        })
      .then(res => {
        const cleanLink = newVid.title.replace(/\s+/g, '-').toLowerCase();
        this.props.history.push(`/videos/${newVid.id}/${cleanLink}`);
      })
      .catch(error => {
        console.error({error});
        const cleanLink = newVid.title.replace(/\s+/g, '-').toLowerCase();
        this.props.history.push(`/videos/${newVid.id}/${cleanLink}`);
      });
    }
    else {
      fetch(`${config.API_ENDPOINT}/api/vid-tags`, {
        method: 'POST',
        body: JSON.stringify(this.state.allTags),
        headers: {
          'content-type': 'application/json',
          'authorization': `bearer ${TokenService.getAuthToken()}`
        }
      })
      .then(res => {
          const cleanLink = newVid.title.replace(/\s+/g, '-').toLowerCase();
          this.props.history.push(`/videos/${newVid.id}/${cleanLink}`);
      })
      .catch(error => {
          this.setState({ error })
          const cleanLink = newVid.title.replace(/\s+/g, '-').toLowerCase();
          this.props.history.push(`/videos/${newVid.id}/${cleanLink}`);
      })
    }
  }

  addResource = () => {
    let newCount = this.state.resCount;
    newCount.push(newCount.length + 1);
    
    this.setState({
      resCount: newCount
    });
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

  removeResource = id => {
    const arr = this.state.resCount;
    const indy = arr.indexOf(id);
    if(indy > -1) {
      arr.splice(indy, 1);
    }
    this.setState({
      resCount: arr
    });
  }

  handleClickCancel = () => {
    this.props.history.push('/');
  };

  render() {
    const titleError = this.validateTitle();
    const descError = this.validateDesc();
    const linkError = this.validateLink();
    const dateError = this.validateDate();

    const videoResources = this.state.resCount.map(vid => 
      <AddVidResource
          key={vid}
          id={vid}
          updateVidRes={this.updateVidRes}
          removeReso={this.removeResource}
      />
    );

    const newTags = this.state.tagCount.map(tag => 
      <AddVidTag
          key={tag}
          id={tag}
          removeTag={this.removeVidTag}
      />
    );

    return (
        <section className='AdminVideos'>
            <h1 className='adminVideosHeader'>Add a Video</h1>
            <form 
                className='AdminVideos_form'
            >
                <label htmlFor='vidTitle'>
                    Video title
                </label>
                <section className='adminVideos_formInput'>
                  <input
                      type='text'
                      id='vidTitle'
                      placeholder='My New Video'
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
                      type='text'
                      id='vidDesc'
                      placeholder='This is the most amazig video yet!'
                      onChange={e => this.updateDesc(e.target.value)}
                      required
                  />
                  {this.state.description.touched && (
                      <ValidationError message={descError} />
                  )}
                </section>
                <label htmlFor='ytLink'>
                    YouTube Video ID
                </label>
                <section className='adminVideos_formInput'>
                  <input
                      type='text'
                      id='ytLink'
                      placeholder='cywyb3Y6Qxg'
                      onChange={e => this.updateLink(e.target.value)}
                      required
                  />
                  {this.state.link.touched && (
                      <ValidationError message={linkError} />
                  )}
                </section>
                <label htmlFor='date'>
                    Date posted
                </label>
                <section className='adminVideos_formInput'>
                  <input
                      type='date'
                      id='date'
                      min='2018-01-01'
                      onChange={e => this.updateDate(e.target.value)}
                      required
                  />
                  <p className='dateHelperText'>(date uploaded to YouTube, not this site)</p>
                  {this.state.date.touched && (
                      <ValidationError message={dateError} />
                  )}
                </section>
                <label htmlFor='tagsRef'>
                        Add relevant topic tags:
                </label>
                <p className='tagsRefHelperText'>(check all that apply)</p>
                <section className='adminVideos_formInput' id='addVideosTags'>
                  {this.state.tagsRef.map(type =>
                    <section className='tagsRef_select'>
                      <input value={type.id} key={type.id} type='checkbox' name='tags' onChange={e => this.updateTags(e.target.value)}/>
                      <label htmlFor={type.id} >{type.tag}</label>
                    </section>
                  )}
                  {newTags}
                  <button className='addVideosAddTags' onClick={this.addTag}>Add Tag</button>
                  {this.state.tagsError.status ? <div className='formError'>{this.state.tagsError.value}</div> : ''}
                </section>
                <h3 className='vidResources'>Resources for this Video</h3>
                {videoResources}
                <button className='adminVideos_formResourcesMore' type='button' onClick={this.addResource}>Add another resource</button>
                <div className='AddDestinationForm_buttons'>
                    <button 
                        type='button' onClick={() => this.handleSubmit()}
                    >
                        Add Video
                    </button>
                    {' '}
                    <button type='button' onClick={this.handleClickCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </section>
    );
  };
};

export default withRouter(AddVideos);
