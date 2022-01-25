import { createStore } from "redux";
import statedata from "../data/statedata";

const fetchData = () => {
    if(sessionStorage.getItem('treedata') !== null) {
        return JSON.parse(sessionStorage.getItem('treedata'))
    }
    return statedata
}

const treeStoreReducer = (state = fetchData(), action) => {

    const treedata = state.treedata.data;
    
    let updatedData = [];

    switch(action.type) {
        case 'CHECK':
            const {checkVal, props} = action

            updatedData = treedata.map(cat => checkCat(cat, props, checkVal))

            break
            
        case 'DELETE': {
            const {id, cat_id} = action.props

            updatedData = treedata.map(cat => {
                if(cat.id === cat_id) {
                    const updatedOptions = cat.options.filter(opt => opt.id !== id)
                    return {...cat,
                        options: updatedOptions,
                        checked: updatedOptions.every(opt => opt.checked),
                        indeterminate: updatedOptions.some(opt => opt.checked) && !updatedOptions.every(opt => opt.checked)
                    }
                }
                return cat
            })

            break
        }

        case 'EDIT': {
            const {id, cat_id} = action.props
            const newVal = action.newVal

            updatedData = treedata.map(cat => {
                if(cat.id === cat_id) {
                    const updatedOptions = cat.options.map(opt => {
                        if(opt.id === id) return {...opt, name: newVal}
                        return opt
                    })
                    return {...cat,
                        options: updatedOptions
                    }
                }
                return cat
            })

            break
        }

        default:
            updatedData = treedata
        
    }

    const newState = { treedata: {data: updatedData }}
    sessionStorage.setItem('treedata', JSON.stringify(newState))
    return newState;
}

const checkCat = (cat, props, checkVal) => {
    const catId = props.cat_id || props.id;
    
    if(props.isSearch || cat.id === catId) {  // updated one

        const updatedOptions = cat.options.map(opt => checkOpt(opt, props, checkVal))

        return {...cat,
            options: updatedOptions,
            checked: props.isSearch || props.level === 0 ? checkVal : updatedOptions.every(opt => opt.checked),
            indeterminate: updatedOptions.some(opt => opt.checked) && !updatedOptions.every(opt => opt.checked)
        }
    }

    return cat
}

const checkOpt = (opt, props, checkVal) => {
    
    if(props.isSearch || props.level === 0 || opt.id === props.id)
    return {...opt, checked: checkVal}
    
    return opt
}

const store = createStore(treeStoreReducer);

export default store