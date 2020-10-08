import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ValidationError from '../ValidationError/ValidationError';
import APIContext from '../APIContext';
import config from '../config';
import './EditVideos.css';

class EditVideos extends Component {
  static contextType = APIContext;

  constructor(props) {
    super(props)
    this.state = {
      videos: [],
      vidResources: [],
      tagsRef: [],
      vidTags: [],
      title: { value: '', touched: false },
      description: { value: '', touched: false },
      link: { value: '', touched: false },
      tags: { value: [], touched: false }
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
    if(this.context.comments.length < 1) {
        this.updateState();
    }
    else {
        this.setState({
            videos: this.context.videos,
            vidResources: this.context.vidResources,
            tagsRef: this.context.tagsRef,
            vidTags: this.context.vidTags
        })
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
    if (!link.includes('embed')) {
      return `The link should include the word "embed" (ex: https://www.youtube.com/embed/cywyb3Y6Qxg)`;
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

  // normalize form input values before passing to the POST function
  validateInput = e => {
    e.preventDefault();
    const currentVid = this.state.videos.find(({ id }) => id === parseInt(this.props.match.params.vid));
    let updatedVid = {
      id: parseInt(this.props.match.params.vid),
      title: currentVid.title,
      description: currentVid.description,
      youtube_id: currentVid.youtube_id,
      date_posted: currentVid.date_posted
    };
    
    if(currentVid.title !== this.state.title.value && this.state.title.touched === true) {
      updatedVid.title = this.state.title.value;
    }
    if(currentVid.description !== this.state.description.value && this.state.description.touched === true) {
      updatedVid.description = this.state.description.value;
    }
    if(currentVid.youtube_id !== this.state.link.value && this.state.link.touched === true) {
      updatedVid.youtube_id = this.state.link.value;
    }

   this.handleSubmit(updatedVid);
  };

  handleSubmit = (input) => {
    this.handleTagsPost(input);
/*
    fetch(`${config.API_ENDPOINT}/api/videos/${input.id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
        headers: {
          'content-type': 'application/json'
        }
      })
        .then(res => {
          if (!res.ok) {
            return res.json().then(error => {
              throw error
            })
          }
          return res.json()
        })
        .then(newVid => {
            this.handleTagsPost(input);
        })
        .catch(error => {
          this.setState({ error })
        })*/
  };

  handleTagsPost = (input) => {
    if(this.state.tags.touched === false) {
      const cleanLink = input.title.replace(/\s+/g, '-').toLowerCase();
      this.props.history.push(`/videos/${input.id}/${cleanLink}`);
    }
    else {
      let currentTags = [];
      for(let i = 0; i < this.state.vidTags.length; i++) {
        if(this.state.vidTags[i].vid_id === parseInt(this.props.match.params.vid)) {
          let newArr = currentTags;
          newArr.push(this.state.vidTags[i].tag_id);
          currentTags = newArr;
        }
      }

      let newTags = [];
      for(let i = 0; i < this.state.tags.value.length; i++) {
        const checkTag = currentTags.includes(this.state.tags.value[i]);
        if(checkTag === false) {
          let newArr = newTags;
          newArr.push(this.state.tags.value[i]);
          newTags = newArr;
        }
      }

      
      let tagsToDelete = [];
      for(let i = 0; i < currentTags.length; i++) {
        const checkTag = this.state.tags.value.includes(currentTags[i]);
        if(checkTag === false) {
          let newArr = tagsToDelete;
          newArr.push(currentTags[i]);
          tagsToDelete = newArr;
        }
      }

      if(newTags.length > 0) {
        const newVidTags = {
          tags: newTags,
          vid_id: input.id
        }
        
        fetch(`${config.API_ENDPOINT}/api/vid-tags`, {
          method: 'POST',
          body: JSON.stringify(newVidTags),
          headers: {
            'content-type': 'application/json'
          }
        })
          .then(res => {
            if (!res.ok) {
              return res.json().then(error => {
                throw error
              })
            }
            /*
            const cleanLink = newVid.title.replace(/\s+/g, '-').toLowerCase();
            this.props.history.push(`/videos/${newVid.id}/${cleanLink}`);*/
          })
          .catch(error => {
            this.setState({ error })
          })
      }

      if(tagsToDelete.length > 0) {
        let deleteIDs = [];
        const allVidTags = this.state.vidTags.filter(function(t) {
          return t.vid_id === input.id;
        });

        for(let i = 0; i < tagsToDelete.length; i++) {
          const checkTag = allVidTags.find(({ tag_id }) => tag_id === tagsToDelete[i]);
          if(checkTag) {
            let newArr = deleteIDs;
            newArr.push(checkTag.id);
            deleteIDs = newArr;
          }
        }

        /*
        fetch(`${config.API_ENDPOINT}/api/vid-tags`, {
          method: 'DELETE',
          body: JSON.stringify(newVidTag),
          headers: {
            'content-type': 'application/json'
          }
        })
          .then(res => {
            if (!res.ok) {
              return res.json().then(error => {
                throw error
              })
            }
            const cleanLink = newVid.title.replace(/\s+/g, '-').toLowerCase();
            this.props.history.push(`/videos/${newVid.id}/${cleanLink}`);
          })
          .catch(error => {
            this.setState({ error })
          })*/
      }
      
    }
  };

  handleClickCancel = () => {
    this.props.history.push('/');
  };

  // pre-check select options for tags related to this video
  renderTags = tagID => {
    let thisVidTags = [];
    for(let i = 0; i < this.state.vidTags.length; i++) {
      if(this.state.vidTags[i].vid_id === parseInt(this.props.match.params.vid)) {
        const addTag = thisVidTags;
        addTag.push(this.state.vidTags[i].tag_id)
        thisVidTags = addTag;
      }
    }

    const findTag = thisVidTags.find(id => id === tagID);
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
    const findVid = this.context.videos.filter(vid => 
      vid.id === parseInt(this.props.match.params.vid)
    );
    const thisVideo = findVid[0];
    const titleError = this.validateTitle();
    const descError = this.validateDesc();
    const linkError = this.validateLink();
    const tagsError = this.validateTags();

    return (
        <section className='AdminVideos'>
            <h1 className='adminVideosHeader'>Edit {thisVideo.title}</h1>
            <form 
                className='AdminVideos_form'
                onSubmit={this.validateInput}
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
                      type="text"
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
                        Add relevant topic tags
                </label>
                <section className='adminVideos_formInput'>
                  {this.state.tagsRef.map(type =>
                    <section className='tagsRef_select'>
                      <input value={type.id} key={type.id} type='checkbox' name='tags' checked={this.renderTags(type.id)} onChange={e => this.updateTags(e.target.value)}/>
                      <label htmlFor={type.id} >{type.tag}</label>
                    </section>
                  )}
                  {this.state.tags.touched && (
                      <ValidationError message={tagsError} />
                  )}
                </section>
                <div className='AddDestinationForm_buttons'>
                    <button 
                        type='submit'
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

export default withRouter(EditVideos);
