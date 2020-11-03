/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tf from '@tensorflow/tfjs-core';
import * as tfwebgl from '@tensorflow/tfjs-backend-webgl';
import * as tfcpu from '@tensorflow/tfjs-backend-cpu';
import * as tfwebgpu from '@tensorflow/tfjs-backend-webgpu';
import * as qna from '@tensorflow-models/qna';

let modelPromise = {};
let search;
let input;
let contextDiv;
let answerDiv;

const process = async () => {
  await tf.ready();
  modelPromise = qna.load();
  const model = await modelPromise;
  const start = performance.now();
  const answers = await model.findAnswers(input.value, contextDiv.value);
  const end = performance.now();
  console.log(end - start);
  const webgpuBackend = tf.findBackend("webgpu");
  webgpuBackend.getResult();
  console.log(answers);
  answerDiv.innerHTML =
      answers.map(answer => answer.text + ' (score =' + answer.score + ')')
          .join('<br>');
};

window.onload = () => {
  input = document.getElementById('question');
  search = document.getElementById('search');
  contextDiv = document.getElementById('context');
  answerDiv = document.getElementById('answer');
  search.onclick = process; 

  input.addEventListener('keyup', async (event) => {
    if (event.key === 'Enter') {
      process();
    }
  });
};
