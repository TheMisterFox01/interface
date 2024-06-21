import { makeAutoObservable, toJS } from 'mobx';
import { PaletteMode } from '@mui/material';
import { SubUser } from 'utils/subUsers';

class Store {
  mode: PaletteMode = 'light';
  commonBalance = 0;
  subUsers: SubUser[] = [];
  hash: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  toggleColorMode() {
    this.mode = this.mode === 'dark' ? 'light' : 'dark';
    if (localStorage) {
      localStorage.setItem('theme', this.mode);
    }
  }

  clear() {
    this.commonBalance = 0;
    this.subUsers = [];
    localStorage.clear();
  }

  setBalance(value: number) {
    this.commonBalance = value;
  }

  setSubUsers(value: SubUser[]) {
    this.subUsers = value;
    if (localStorage) {
      localStorage.setItem('subusers', JSON.stringify(value));
    }
  }

  getSubUsers() {
    try {
      if (localStorage) {
        return JSON.parse(localStorage.getItem('subusers') ?? '[]');
      }
    } catch {}
    return toJS(this.subUsers);
  }

  setHash(hash: string) {
    this.hash = hash;
  }

  getHash() {
    return this.hash;
  }
}

const store = new Store();

export default store;
