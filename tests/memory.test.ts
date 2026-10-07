import test from 'node:test';
import assert from 'node:assert/strict';
import {readGuest, worldFrom, storyFrom, type Memory} from '../lib/memory';
const event=(type:Memory['event_type'],id=type):Memory=>({id,event_type:type,game_id:null,character_id:'moco',payload:{color:'そらいろ'},occurred_at:'2026-10-06T00:00:00Z'});
test('malformed local storage never crashes the child experience',()=>{assert.deepEqual(readGuest('oops'),[]);assert.deepEqual(readGuest('{}'),[]);assert.deepEqual(readGuest('[null,3,{}]'),[]);assert.equal(readGuest(JSON.stringify([event('REST')])).length,1);});
test('only relevant memories change the world; play has no reward counter',()=>{assert.deepEqual(worldFrom([event('PLAY'),event('REST'),event('CREATE'),event('DISCOVER'),event('MEET')]),{stars:2,rainbow_paths:1,rest_clouds:1});});
test('book uses the latest eight real memories in chronological order',()=>{const events=Array.from({length:10},(_,i)=>event('CREATE',String(i) as 'CREATE'));const pages=storyFrom(events);assert.equal(pages.length,8);assert.equal(pages[0].id,'2');assert.match(pages[0].text,/そらいろ/);assert.deepEqual(storyFrom([]),[]);});
test('illustrated stories retain chosen food, rainbow color, scene and companion',()=>{
 const kitchen={...event('PLAY'),game_id:'kitchen',character_id:'toto',payload:{food:'おにぎり',plate:['おにぎり']}};
 const p=storyFrom([kitchen])[0];assert.equal(p.scene,'kitchen');assert.equal(p.character,'toto');assert.match(p.text,/おにぎり/);assert.ok(p.question);
 assert.equal(storyFrom([event('REST')])[0].scene,'rest');
 assert.match(storyFrom([{...event('CREATE'),payload:{colors:['ももいろ','みどり','そらいろ']}}])[0].text,/ももいろ、みどり、そらいろ/);
});
test('legacy companion memories remain readable without rewriting their names',()=>{
 const p=storyFrom([{...event('MEET'),character_id:'roo'}])[0];assert.match(p.text,/るう/);assert.equal(p.character,'roo');
});
