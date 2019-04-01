export class Prompt {

  title: string;
  text: string;
  actions : PromptAction[];

}

class PromptAction {

  text: string;
  class: string;
  action: Function;

}