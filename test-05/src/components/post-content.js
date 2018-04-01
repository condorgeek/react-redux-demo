import $ from 'jquery';
import React, {Component} from 'react';

export default class PostContent extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    componentDidMount() {
        const toggler = '#' + this.props.id;

        this.handleHidden = this.handleHidden.bind(this);
        this.handleOpen = this.handleOpen.bind(this);

        $(toggler).on('hidden.bs.collapse', this.handleHidden);
        $(toggler).on('shown.bs.collapse', this.handleOpen);
    }

    handleHidden() {
        this.setState({open: false});
    }

    handleOpen() {
        this.setState({open: true});
    }

    toggler(content, id) {
        return (
            <div className='post-toggler'>

                {content.slice(0, 200)}

                <span className="collapse" id={id}>
                    {content.slice(200)}
                </span>

                <a className="ml-1" data-toggle="collapse" href={`#${id}`}
                   aria-expanded="false" aria-controls={id}>{this.state.open ? "[less ...]" : "[more ...]"}</a>
            </div>
        );
    }

    render() {
        const content = this.props.content.length > 200 ? this.toggler(this.props.content, this.props.id) : this.props.content;

        return (
            <div className='post-content'>
                {content}
            </div>
        );
    }
}