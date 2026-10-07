import test from 'node:test';
import assert from 'node:assert/strict';
import {gardenFrom} from '../lib/world-garden';
import type {Memory} from '../lib/memory';
const event=(event_type:Memory['event_type'],payload:Memory['payload']={}):Memory=>({id:'1',event_type,payload,game_id:null,character_id:'moco',occurred_at:'2026-10-07T00:00:00Z'});
test('meeting never invents discoveries; old discoveries and unsafe rainbow input remain readable',()=>{
 assert.deepEqual(gardenFrom([event('MEET')]).found,[]);
 assert.deepEqual(gardenFrom([event('DISCOVER'),event('DISCOVER',{item:'はっぱ'})]).found,['星','はっぱ']);
 assert.deepEqual(gardenFrom([event('CREATE',{colors:['url(secret)','みどり',null,'そらいろ']})]).colors,['みどり','そらいろ']);
});
