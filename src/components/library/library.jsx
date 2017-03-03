const bindAll = require('lodash.bindall');
const React = require('react');

const LibraryItem = require('../library-item/library-item.jsx');
const ModalComponent = require('../modal/modal.jsx');

const styles = require('./library.css');
const itemStyles = require('../library-item/library-item.css');

const TweenMax = require('gsap').TweenMax;
const TimelineMax = require('gsap').TimelineMax;

class LibraryComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, ['handleSelect']);
        this.state = {selectedItem: null};
    }
    componentDidUpdate (prevProps) {
        if (!prevProps.visible && this.props.visible) {

            const tl = new TimelineMax();

            // set up the timeline
            tl
                // hide sprite items, so we can animate them back in.
                // another method is to just set them to opacity: 0 by default
                // Doing this here for now so technique is readable.
                .set('.' + itemStyles.libraryItem, {autoAlpha: 0})

                // Add a timeline marker, so we can reference the start in the next tween
                .addLabel('beginning')

                // .set('spinner', { display: 'block' })

                // Animate the library sprites in a sequence. 
                // Prepping for a material-like shimmer animation
                .staggerTo(
                    // Specify the collection of children to animate.
                    // @t odo: cleaner way of selecting items without string concat
                    // maybe: this.libraryScrollGrid.children
                    // @t odo: refactor to stagger only what's in view, and restagger on scroll
                    // For now, hardcoded to first how to only get what's in view, say the first 30 items?
                    '.' + itemStyles.libraryItem,

                    0.5, // how long it should take
                    {
                        // Greensock convenience prop to smartly do 2 things:
                        // animate the opacity to something
                        // when it completes, set display property and display when animation completes
                        autoAlpha: 1, 
                        ease: Power4.easeOut
                    },
                    0.05, // delay between each item's animmation
                    'beginning+=0.5'
                )

                .play();
        }
    }
    handleSelect (id) {
        if (this.state.selectedItem === id) {
            // Double select: select as the library's value.
            this.props.onRequestClose();
            this.props.onItemSelected(this.props.data[id]);
        }
        this.setState({selectedItem: id});
    }
    render () {
        if (!this.props.visible) return null;
        return (
            <ModalComponent
                contentLabel={this.props.title}
                visible={this.props.visible}
                onRequestClose={this.props.onRequestClose}
            >
                <h1 className={styles.modalHeader}>{this.props.title}</h1>
                <div className={styles.libraryScrollGrid}>
                    {this.props.data.map((dataItem, itemId) => {
                        const scratchURL = dataItem.md5 ?
                            `https://cdn.assets.scratch.mit.edu/internalapi/asset/${dataItem.md5}/get/` :
                            dataItem.rawURL;
                        return (
                            <LibraryItem
                                iconURL={scratchURL}
                                id={itemId}
                                key={`item_${itemId}`}
                                name={dataItem.name}
                                selected={this.state.selectedItem === itemId}
                                onSelect={this.handleSelect}
                            />
                        );
                    })}
                </div>
            </ModalComponent>
        );
    }
}

LibraryComponent.propTypes = {
    data: React.PropTypes.arrayOf(
        /* eslint-disable react/no-unused-prop-types, lines-around-comment */
        React.PropTypes.shape({
            md5: React.PropTypes.string,
            name: React.PropTypes.string,
            rawURL: React.PropTypes.string
        })
        /* eslint-enable react/no-unused-prop-types, lines-around-comment */
    ),
    onItemSelected: React.PropTypes.func,
    onRequestClose: React.PropTypes.func,
    title: React.PropTypes.string.isRequired,
    visible: React.PropTypes.bool
};

module.exports = LibraryComponent;
