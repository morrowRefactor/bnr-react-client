import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ValidationError from '../ValidationError/ValidationError';
import config from '../config';
import './EditVideos.css';

class EditVideos extends Component {
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
      date: { value: '', touched: false },
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
    if (!link.includes('embed')) {
      return `The link should include the word "embed" (ex: https://www.youtube.com/embed/cywyb3Y6Qxg)`;
    };
    if (link.length === 0) {
      return 'A YouTube embed link is required';
    };
  };

  validateDate() {
    const date = this.state.date.value.trim();
    if (date.length === 0) {
      return 'A posted date is required';
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
    const input = {
        title: this.state.title.value,
        description: this.state.description.value,
        embed_code: this.state.link.value,
        date_posted: this.state.date.value,
        tags: this.state.tags.value
    };

   this.handleSubmit(input);
  };

  handleSubmit(input) {
    const newVid = {
      title: input.title,
      description: input.description,
      embed_code: input.embed_code,
      date_posted: input.date_posted
    }

    fetch(`${config.API_ENDPOINT}/api/videos`, {
        method: 'POST',
        body: JSON.stringify(newVid),
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
            this.handleTagsPost(input.tags, newVid);
        })
        .catch(error => {
          this.setState({ error })
        })
  };

  handleTagsPost(newTags, newVid) {
    const newVidTag = {
      tags: newTags,
      vid_id: newVid.id
    }

    fetch(`${config.API_ENDPOINT}/api/vid-tags`, {
        method: 'POST',
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
        })
  };

  handleClickCancel = () => {
    this.props.history.push('/');
  };

  render() {
    const titleError = this.validateTitle();
    const descError = this.validateDesc();
    const linkError = this.validateLink();
    const dateError = this.validateDate();
    const tagsError = this.validateTags();

    return (
        <section className='AdminVideos'>
            <h1 className='adminVideosHeader'>Add a Video</h1>
            <form 
                className='AdminVideos_form'
                onSubmit={this.validateInput}
            >
                <label htmlFor='vidTitle'>
                    Video title
                </label>
                <input
                    type="text"
                    id="vidTitle"
                    placeholder='My New Video'
                    onChange={e => this.updateTitle(e.target.value)}
                    required
                />
                {this.state.title.touched && (
                    <ValidationError message={titleError} />
                )}
                <label htmlFor='vidDesc'>
                    Video description
                </label>
                <input
                    type="text"
                    id="vidDesc"
                    placeholder='This is the most amazig video yet!'
                    onChange={e => this.updateDesc(e.target.value)}
                    required
                />
                {this.state.description.touched && (
                    <ValidationError message={descError} />
                )}
                <label htmlFor='ytLink'>
                    YouTube link
                </label>
                <input
                    type="text"
                    id="ytLink"
                    placeholder='https://www.youtube.com/embed/cywyb3Y6Qxg'
                    onChange={e => this.updateLink(e.target.value)}
                    required
                />
                {this.state.link.touched && (
                    <ValidationError message={linkError} />
                )}
                <label htmlFor='date'>
                    Date posted
                </label>
                <input
                    type="date"
                    id="date"
                    min="2018-01-01"
                    onChange={e => this.updateDate(e.target.value)}
                    required
                />
                {this.state.date.touched && (
                    <ValidationError message={dateError} />
                )}
                <label htmlFor='tagsRef'>
                        Add relevant topic tags
                    </label>
                {this.state.tagsRef.map(type =>
                  <section className='tagsRef_select'>
                    <input value={type.id} key={type.id} type='checkbox' name='tags' onChange={e => this.updateTags(e.target.value)}/>
                    <label htmlFor={type.id} >{type.tag}</label>
                  </section>
                )}
                {this.state.tags.touched && (
                    <ValidationError message={tagsError} />
                  )}
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
