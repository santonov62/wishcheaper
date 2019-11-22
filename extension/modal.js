document.querySelector('body').innerHTML += `
<style>
@font-face {
    font-family: "Font Awesome 5 Brands";
    font-style: normal;
    font-weight: 400;
    src: url(style/fa-brands-400.woff2) format("woff2")
}
#spinner {
    align-self: center;
}
#content {
    display: flex;
}
#message {
    color: white;
    background-color: #191919;
    padding: 5px;
    border-radius: 5px;
}
#buttons {
    flex-grow: 1;
    display: flex;
}

.hidden {
    display: none !important;
}

.btn {
    margin: .375rem;
    color: inherit;
    text-transform: uppercase;
    word-wrap: break-word;
    white-space: normal;
    cursor: pointer;
    border: 0;
    border-radius: .125rem;
    box-shadow:0 0 7px #fff;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    padding: .84rem 2.14rem;
    font-size: .81rem;
}
.btn-vk {
    color: #fff;
    background-color: #4c75a3!important;
    flex-grow: 1;
}
.btn-add {
    color: #fff;
    background-color: #56b68b!important;
    flex-grow: 1;
}
.waves-effect {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
}
.fab {
    font-family: "Font Awesome 5 Brands";
}
.fa, .fab, .fad, .fal, .far, .fas {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    display: inline-block;
    font-style: normal;
    font-variant: normal;
    text-rendering: auto;
    line-height: 1;
}
.pr-1, .px-1 {
    padding-right: .25rem!important;
}
.fa-vk:before {
    content: "\\f189";
}
.lds-ripple {
    display: inline-block;
    position: relative;
    width: 64px;
    height: 64px;
}
.lds-ripple div {
    position: absolute;
    border: 4px solid #fff;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}
.lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
}
@keyframes lds-ripple {
    0% {
        top: 28px;
        left: 28px;
        width: 0;
        height: 0;
        opacity: 1;
    }
    100% {
        top: -1px;
        left: -1px;
        width: 58px;
        height: 58px;
        opacity: 0;
    }
}
</style>

<div class="modal">
  <div id="content">
      <div id="buttons" class="hidden">
          <button id="vk" type="button" class="btn btn-vk waves-effect waves-light">
              <i class="fab fa-vk pr-1"></i> Авторизоваться
          </button>
      </div>
      <div id="message" class="hidden"></div>
      <div id="success" class="hidden">
          Добавлено!
          <br />
          <button id="open" >Открыть</button>
      </div>
      <div id="error" class="hidden">
          <div>Не получилось добавить :(</div>
      </div>
  </div>
  <div id="spinner" class="lds-ring">
      <div></div><div></div><div></div><div></div>
      Добавляем...
  </div>
</div>
`;
