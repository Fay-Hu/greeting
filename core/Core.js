/**
 * Created by hufei on 2017/3/12.
 */

import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  AudioListener,
  Audio,
  AudioLoader,
  Group
} from '../libs/three.module'
import Hammer from '../node_modules/hammerjs/hammer'

let CommonDefault = {
  //摄像机角度
  fov: 50,
  //相机视锥体近裁剪面
  near: 1,
  //相机视锥体远裁剪面
  far: 1000
}

class Component {

  constructor(props) {
    let
      [element, options] = props,
      opts = this.options = Object.assign(CommonDefault, this.constructor.Default, options)

    this.element = element
    this.renderer = new WebGLRenderer()
    this.camera = new PerspectiveCamera(opts.fov, window.innerWidth / window.innerHeight, opts.near, opts.far)
    this.scene = new Scene()
    this.rootGroup = new Group()
    if (this.options.audioUrl) {
      this._initAudio()
    }

    this.handle()
  }

  _initAudio() {
    let audioListener = new AudioListener()
    let oceanAmbientSound = new Audio(audioListener)
    this.scene.add(oceanAmbientSound)
    let loader = new AudioLoader()
    loader.load(
      // 资源链接
      this.options.audioUrl,
      // 资源加载完成后的回调函数
      function (audioBuffer) {
        // set the audio object buffer to the loaded object
        oceanAmbientSound.setBuffer(audioBuffer);

        // 播放音频
        oceanAmbientSound.play();
      },
      // 资源加载过程中的回调函数
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
      },
      // 资源下载错误的回调函数
      function (xhr) {
        console.log('An error happened');
      }
    );
    return this
  }

  resize() {
    this.state.width = window.innerWidth
    this.state.height = window.innerHeight

    this.camera.aspect = this.state.width / this.state.height
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.state.width, this.state.height)
    this.renderer.setPixelRatio( window.devicePixelRatio )
  }

  handle() {
    let
      hammertime = new Hammer(document)

    window.addEventListener('resize', this.resize.bind(this))

    hammertime.get('pan').set({direction: Hammer.DIRECTION_ALL})

    hammertime.on('pan', ev => {
      this.rootGroup.rotation.x += ev.deltaY * 0.0001
      this.rootGroup.rotation.y += ev.deltaX * 0.0001
    })
  }
}

export {
  Component
}