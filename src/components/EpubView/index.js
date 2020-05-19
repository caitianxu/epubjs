import React, { Component } from 'react';
import Epub from 'epubjs';
import './index.scss';

export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toc: [],
      themeList: [
        {
          name: 'default',
          style: {
            body: {
              color: '#fff',
              background: '#ddd',
            },
          },
        },
      ],
    };
    this.book = null;
    this.rendition = null;
    this.themes = null;
  }
  //初始化
  componentDidMount() {
    this.initReader();
  }
  //加载epub
  initReader = () => {
    const { localFile, epubLoadEd } = this.props;
    this.book = new Epub(localFile);
    this.book.loaded.navigation.then(({ toc }) => {
      this.setState({ toc });
      //回调上一级
      epubLoadEd && epubLoadEd(toc);
      //开始渲染
      this.rendition = this.book.renderTo(this.viewerRef, {
        contained: true,
        width: '100%',
        height: '100%',
      });
      this.themes = this.rendition.themes;
      this.state.themeList.forEach((theme) => {
        this.themes.register(theme.name, theme.style);
      });
      this.themes.select('default')
      
      //直接加载第一章
      this.rendition.display(toc[1].href);
    });
  };
  //上一页
  prevPage = () => {
    // this.rendition.themes.fontSize("100%");
    this.rendition.prev();
    console.log(this.rendition.location.start.index);
  };
  //下一页
  nextPage = () => {
    this.rendition.themes.register({ p: { color: 'purple' } });
    this.rendition.next();
    console.log(this.rendition.location.start.index);
  };
  render() {
    return (
      <div className='viewHolder'>
        <div className='header'>name</div>
        <div className='view' ref={(el) => (this.viewerRef = el)}></div>
        <div className='footer'>
          <button onClick={this.prevPage}>prev</button>
          <button onClick={this.nextPage}>next</button>
        </div>
      </div>
    );
  }
}
