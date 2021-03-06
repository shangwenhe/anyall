## 初始化过程

正如多数 linux 软件，vim 的配置文件分为系统配置文件 /etc/vimrc，/usr/share/vim/ 和用户配置文件 ~/.vimrc，~/.vim/。

vim 的配置文件载入过程为：

/etc/vimrc
$HOME/.vim/，$HOME/.vimrc
$VIMRUNTIME/.vim，$VIMRUNTIME/.vimrc
$HOME/.vim/after/
通过运行 vim -V 可查看整个初始化过程。
示例配置文件

## 一个示例配置文件如下：

```

" .vimrc
" See: http://vimdoc.sourceforge.net/htmldoc/options.html for details

" For multi-byte character support (CJK support, for example):
" set fileencodings=ucs-bom,utf-8,cp936,big5,euc-jp,euc-kr,gb18030,latin1
       
set tabstop=4       " Number of spaces that a <Tab> in the file counts for.
 
set shiftwidth=4    " Number of spaces to use for each step of (auto)indent.
 
set expandtab       " Use the appropriate number of spaces to insert a <Tab>.
                    " Spaces are used in indents with the '>' and '<' commands
                    " and when 'autoindent' is on. To insert a real tab when
                    " 'expandtab' is on, use CTRL-V <Tab>.
 
set smarttab        " When on, a <Tab> in front of a line inserts blanks
                    " according to 'shiftwidth'. 'tabstop' is used in other
                    " places. A <BS> will delete a 'shiftwidth' worth of space
                    " at the start of the line.
 
set showcmd         " Show (partial) command in status line.

set number          " Show line numbers.

set showmatch       " When a bracket is inserted, briefly jump to the matching
                    " one. The jump is only done if the match can be seen on the
                    " screen. The time to show the match can be set with
                    " 'matchtime'.
 
set hlsearch        " When there is a previous search pattern, highlight all
                    " its matches.
 
set incsearch       " While typing a search command, show immediately where the
                    " so far typed pattern matches.
 
set ignorecase      " Ignore case in search patterns.
 
set smartcase       " Override the 'ignorecase' option if the search pattern
                    " contains upper case characters.
 
set backspace=2     " Influences the working of <BS>, <Del>, CTRL-W
                    " and CTRL-U in Insert mode. This is a list of items,
                    " separated by commas. Each item allows a way to backspace
                    " over something.
 
set autoindent      " Copy indent from current line when starting a new line
                    " (typing <CR> in Insert mode or when using the "o" or "O"
                    " command).
 
set textwidth=79    " Maximum width of text that is being inserted. A longer
                    " line will be broken after white space to get this width.
 
set formatoptions=c,q,r,t " This is a sequence of letters which describes how
                    " automatic formatting is to be done.
                    "
                    " letter    meaning when present in 'formatoptions'
                    " ------    ---------------------------------------
                    " c         Auto-wrap comments using textwidth, inserting
                    "           the current comment leader automatically.
                    " q         Allow formatting of comments with "gq".
                    " r         Automatically insert the current comment leader
                    "           after hitting <Enter> in Insert mode. 
                    " t         Auto-wrap text using textwidth (does not apply
                    "           to comments)
 
set ruler           " Show the line and column number of the cursor position,
                    " separated by a comma.
 
set background=dark " When set to "dark", Vim will try to use colors that look
                    " good on a dark background. When set to "light", Vim will
                    " try to use colors that look good on a light background.
                    " Any other value is illegal.
 
" set mouse=a         Enable the use of the mouse.
 
filetype plugin indent on
syntax on
```


# 上下键搜索历史记录

```
if [[ $- == *i* ]]; then
  bind '"\e[A": history-search-backward'
  bind '"\e[B": history-search-forward'
fi
```


# git仓库目录下显示当前所在分支
```
function git_branch {
   branch="`git branch 2>/dev/null | grep "^\*" | sed -e "s/^\*\ //"`"
   if [ "${branch}" != "" ];then
       if [ "${branch}" = "(no branch)" ];then
           branch="(`git rev-parse --short HEAD`...)"
       fi
       echo "[$branch]"
   fi
}

export PS1='\[\033[01;32m\]\u@\h\[\033[00m\] \[\033[01;31m\]\W\$$(git_branch)\[\033[00m\] '
```
## 安装插件
```
" set the runtime path to include Vundle and initialize
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
" alternatively, pass a path where Vundle should install plugins
"call vundle#begin('~/some/path/here')

" let Vundle manage Vundle, required
Plugin 'VundleVim/Vundle.vim'

" plugin from http://vim-scripts.org/vim/scripts.html
Plugin 'https://github.com/vim-scripts/L9'
Plugin 'editorconfig/editorconfig-vim'
Plugin 'pangloss/vim-javascript'
Plugin 'beautify-web/js-beautify'
Plugin 'maksimr/vim-jsbeautify'
Plugin 'nathanaelkane/vim-indent-guides'
Plugin 'tomtom/tlib_vim'
Plugin 'tomtom/tskeleton_vim'
Plugin 'mxw/vim-jsx'
Plugin 'posva/vim-vue'



" All of your Plugins must be added before the following line
call vundle#end()            " required
filetype plugin indent on    " required
" To ignore plugin indent changes, instead use:
"filetype plugin on
"
" Brief help
" :PluginList       - lists configured plugins
" :PluginInstall    - installs plugins; append `!` to update or just :PluginUpdate
" :PluginSearch foo - searches for foo; append `!` to refresh local cache
" :PluginClean      - confirms removal of unused plugins; append `!` to auto-approve removal
```
## 插件调用
``` 
".vimrc
" map <c-f> :call JsBeautify()<cr>
" or
autocmd FileType javascript noremap <buffer>  <c-f> :call JsBeautify()<cr>
" for json
" autocmd FileType json noremap <buffer> <c-f> :call JsonBeautify()<cr>
autocmd FileType json noremap <buffer> <c-f> :call JsonBeautify()<cr>
" for jsx
autocmd FileType jsx noremap <buffer> <c-f> :call JsxBeautify()<cr>
" for html
autocmd FileType html noremap <buffer> <c-f> :call HtmlBeautify()<cr>
" for css or scss
autocmd FileType css,less noremap <buffer> <c-f> :call CSSBeautify()<cr>
" autocmd BufNewFile *.php 0r  ~/.vim/bundle/skeletons.vim/skeletons/skeleton.php

autocmd FileType *  noremap <buffer> <c-x> :%s/\(\s*\)$//g <cr>


let tskelUserName = '商文河'
let tskelUserEmail = 'shangwenhe@baidu.com'
let tskelLicense = '`$(data %Y)`©北京百度在线有限公司'
let tskelDateFormat = "%Y-%m-%d %H:%M"
let tskelUserCompany = '北京百度在线有限公司'

autocmd BufNewFile *.class\.js  TSkeletonSetup template.class.js
autocmd BufNewFile *.js,*.jsx  TSkeletonSetup template.js
autocmd BufNewFile *.html  TSkeletonSetup template.html
autocmd BufNewFile *.css  TSkeletonSetup template.css
autocmd BufNewFile *.tmpl  TSkeletonSetup template.tmpl


"autocmd BufNewFile /here/*.suffix TSkeletonSetup othertemplate.suffix
autocmd FileType jsx set filetype=js

" autocmd FileType jess  noremap <buffer> <c-f> :call normal()<cr>

autocmd FileType vue syntax sync fromstart
" autocmd BufRead,BufNewFile *.vue setlocal filetype=vue.html.javascript.css

```
